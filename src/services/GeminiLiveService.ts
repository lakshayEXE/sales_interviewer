export interface GeminiMessage {
  text: string;
  sender: 'ai' | 'user';
  timestamp: number;
}

export class GeminiLiveService {
  private ws: WebSocket | null = null;
  private url: string = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
  private apiKey: string = '';

  public onAudioData: ((base64Data: string) => void) | null = null;
  // Fires once per completed utterance, for both the candidate (user) and the AI interviewer.
  public onTranscript: ((sender: 'ai' | 'user', text: string) => void) | null = null;
  public onConnectionStateChange: ((connected: boolean) => void) | null = null;
  // Fires when the server recognizes an interruption (barge-in) by the user.
  public onInterrupt: (() => void) | null = null;
  // Fires when the model reports (via the set_current_question tool) the current question/problem.
  public onQuestion: ((question: string) => void) | null = null;
  // Fires when the model loads starter code into the editor (via the set_editor_code tool).
  public onEditorCode: ((code: string, language: string) => void) | null = null;
  // Fires when the model opens the Mock CRM.
  public onOpenCRM: (() => void) | null = null;
  // Fires when the model opens the Presentation Pitch Deck.
  public onOpenPresentation: (() => void) | null = null;

  public onGatekeeper: (() => void) | null = null;
  public onPromotion: (() => void) | null = null;
  public onRejection: (() => void) | null = null;
  public onRetry: (() => void) | null = null;
  public onEndPhase: (() => void) | null = null;
  public onEndSession: (() => void) | null = null;

  // Accumulate streaming transcription chunks until an utterance is complete.
  private userBuffer: string = '';
  private aiBuffer: string = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect(systemInstructions: string, voice?: { voiceName?: string; languageCode?: string }) {
    if (!this.apiKey) {
      console.error("No API key provided for GeminiLiveService.");
      return;
    }

    if (this.ws) {
      this.ws.close();
    }

    const wsUrl = `${this.url}?key=${this.apiKey}`;
    const ws = new WebSocket(wsUrl);
    this.ws = ws;

    ws.onopen = () => {
      console.log("WebSocket connected. Sending setup message...");
      this.onConnectionStateChange?.(true);

      const speechConfig: any = {};
      if (voice?.voiceName) {
        speechConfig.voiceConfig = { prebuiltVoiceConfig: { voiceName: voice.voiceName } };
      }
      if (voice?.languageCode) {
        speechConfig.languageCode = voice.languageCode;
      }

      const setupMessage = {
        setup: {
          model: "models/gemini-3.1-flash-live-preview",
          generationConfig: {
            responseModalities: ["AUDIO"],
            temperature: 1.0,
            ...(Object.keys(speechConfig).length > 0 ? { speechConfig } : {}),
          },
          systemInstruction: {
            parts: [{ text: systemInstructions }]
          },
          tools: [{
            functionDeclarations: (() => {
              const tools: any[] = [
                {
                  name: "set_current_question",
                  description: "Call this tool EVERY time you ask the candidate a new question or pose a new coding/DSA problem. The text you provide will be displayed on their screen. Keep it clean and self-contained (just the question/problem).",
                  parameters: {
                    type: "object",
                    properties: {
                      text: {
                        type: "string",
                        description: "The text of the question or problem to display."
                      }
                    },
                    required: ["text"]
                  }
                },
                {
                  name: "set_editor_code",
                  description: "Call this tool to load starter code into the candidate's code editor. Use ONLY for debug or optimize tasks, not for implement-from-scratch tasks.",
                  parameters: {
                    type: "object",
                    properties: {
                      code: {
                        type: "string",
                        description: "The starter code to place in the editor."
                      },
                      language: {
                        type: "string",
                        description: "The programming language id, one of: javascript, typescript, python, java, cpp, go, rust."
                      }
                    },
                    required: ["code", "language"]
                  }
                },
                {
                  name: "end_phase",
                  description: "Call this tool to end the current interview phase and move to the next one.",
                  parameters: { type: "object", properties: {} }
                },
                {
                  name: "end_session",
                  description: "Call this tool to hang up the call and completely end the interview session.",
                  parameters: { type: "object", properties: {} }
                }
              ];

              if (systemInstructions.includes('[CRM EDITOR TOOL]')) {
                tools.push({
                  name: "open_crm_editor",
                  description: "Call this tool to open the Mock CRM / Email Follow-Up interface. CRITICAL: Use this ONLY if the current phase instructions explicitly tell you to conduct an email follow-up. Do NOT call this during Roleplay.",
                  parameters: { type: "object", properties: {} }
                });
              }

              if (systemInstructions.includes('[PRESENTATION DECK TOOL]')) {
                tools.push({
                  name: "open_presentation",
                  description: "Call this tool to open the Pitch Deck presentation viewer. CRITICAL: Use this ONLY if the current phase instructions explicitly tell you to conduct a Pitch Deck Presentation. Do NOT call this during Roleplay or standard interviews.",
                  parameters: { type: "object", properties: {} }
                });
              }

              if (systemInstructions.includes('trigger_promotion')) {
                tools.push({
                  name: "trigger_gatekeeper",
                  description: "Call this tool IMMEDIATELY when the candidate says they are ready and you start acting as the Gatekeeper/Receptionist.",
                  parameters: { type: "object", properties: {} }
                });
                tools.push({
                  name: "trigger_promotion",
                  description: "Call this tool when the candidate successfully passes the Gatekeeper. This promotes them to the Decision Maker.",
                  parameters: { type: "object", properties: {} }
                });
                tools.push({
                  name: "trigger_rejection",
                  description: "Call this tool when the candidate fails to convince the Gatekeeper. This switches you into Coach mode.",
                  parameters: { type: "object", properties: {} }
                });
                tools.push({
                  name: "trigger_retry",
                  description: "Call this tool when the candidate says they are ready to retry the Gatekeeper call.",
                  parameters: { type: "object", properties: {} }
                });
              }

              return tools;
            })()
          }],
          outputAudioTranscription: { },
          inputAudioTranscription: { },
          // Be patient: tolerate longer thinking pauses before treating the candidate as done.
          realtimeInputConfig: {
            automaticActivityDetection: {
              startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
              endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
              prefixPaddingMs: 300,
              silenceDurationMs: 1800
            }
          }
        }
      };

      ws.send(JSON.stringify(setupMessage));
    };

    ws.onmessage = async (event) => {
      let data = event.data;
      if (data instanceof Blob) {
        data = await data.text();
      }
      this.handleIncomingMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
      this.onConnectionStateChange?.(false);
      if (this.ws === ws) {
        this.ws = null;
      }
    };
  }

  private isSetupComplete: boolean = false;

  private handleIncomingMessage(data: any) {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      
      // If the API returns an array of messages, process each one
      if (Array.isArray(parsed)) {
        parsed.forEach(msg => this.handleIncomingMessage(msg));
        return;
      }

      if (parsed.setupComplete) {
        console.log("Setup complete. Ready for audio streaming.");
        this.isSetupComplete = true;
        this.sendText("[SYSTEM: The interview has now begun. Please greet the candidate warmly and wait for their response.]");
      }

      // Look for serverContent
      if (parsed.serverContent) {
        const sc = parsed.serverContent;

        // Candidate's speech transcription (from inputAudioTranscription).
        // Streams in chunks, so accumulate until the candidate's turn is over.
        if (sc.inputTranscription?.text) {
          this.userBuffer += sc.inputTranscription.text;
        }

        // AI interviewer's speech transcription (from outputAudioTranscription).
        // When the model starts speaking, the candidate has finished — flush their turn first.
        if (sc.outputTranscription?.text) {
          this.flushUser();
          this.aiBuffer += sc.outputTranscription.text;
        }

        // Audio playback (and a fallback for any text parts the model still emits).
        if (sc.modelTurn?.parts) {
          for (const part of sc.modelTurn.parts) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith('audio/pcm')) {
              this.onAudioData?.(part.inlineData.data);
            }
            if (part.text) {
              this.flushUser();
              this.aiBuffer += part.text;
            }
          }
        }

        // Handle interruption (barge-in) from the server
        if (sc.interrupted) {
          this.aiBuffer = ''; // discard the incomplete sentence from the transcript
          this.onInterrupt?.();
        }

        // End of the model's turn: commit whatever is buffered for both sides.
        if (sc.turnComplete) {
          this.flushUser();
          this.flushAi();
        }
      }

      // Structured tool calls from the model (silent — not part of the spoken audio).
      if (parsed.toolCall?.functionCalls) {
        this.handleToolCalls(parsed.toolCall.functionCalls);
      }
    } catch (err) {
      console.error("Failed to parse incoming WS message", err);
    }
  }

  private handleToolCalls(functionCalls: any[]) {
    const responses: any[] = [];
    for (const fc of functionCalls) {
      if (fc?.name === 'set_current_question') {
        const question = typeof fc.args?.question === 'string' ? fc.args.question.trim() : '';
        if (question) this.onQuestion?.(question);
      } else if (fc?.name === 'set_editor_code') {
        const code = typeof fc.args?.code === 'string' ? fc.args.code : '';
        const language = typeof fc.args?.language === 'string' ? fc.args.language : '';
        if (code) this.onEditorCode?.(code, language);
      } else if (fc?.name === 'open_crm_editor') {
        this.onOpenCRM?.();
      } else if (fc?.name === 'open_presentation') {
        this.onOpenPresentation?.();
      } else if (fc?.name === 'trigger_gatekeeper') {
        this.onGatekeeper?.();
      } else if (fc?.name === 'trigger_promotion') {
        this.onPromotion?.();
      } else if (fc?.name === 'trigger_rejection') {
        this.onRejection?.();
      } else if (fc?.name === 'trigger_retry') {
        this.onRetry?.();
      } else if (fc?.name === 'end_phase') {
        this.onEndPhase?.();
      } else if (fc?.name === 'end_session') {
        this.onEndSession?.();
      }
      // Always acknowledge so the model doesn't stall waiting for a function result.
      responses.push({ id: fc?.id, name: fc?.name, response: { result: 'ok' } });
    }
    if (responses.length && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ toolResponse: { functionResponses: responses } }));
    }
  }

  private flushUser() {
    const text = this.userBuffer.trim();
    this.userBuffer = '';
    if (text) this.onTranscript?.('user', text);
  }

  private flushAi() {
    const text = this.aiBuffer.trim();
    this.aiBuffer = '';
    if (text) this.onTranscript?.('ai', text);
  }

  sendAudio(base64Data: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        realtimeInput: {
          audio: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Data
          }
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendText(text: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: text }]
            }
          ],
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendProctorNudge(instruction: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: `[PROCTOR EVENT: ${instruction} If it feels natural, gently and casually check in with the candidate (e.g. "everything okay?"). Do NOT accuse them of cheating, and do not mention monitoring or cameras. Keep it brief and warm. If you are mid-question, you may ignore this.]` }]
            }
          ],
          turnComplete: false
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendCodeContext(code: string, language: string = "javascript") {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: `[SYSTEM INJECTION: The candidate just updated their code. DO NOT respond or acknowledge this update out loud. Just keep it in mind for when they ask a question.]\n\nCandidate's current code editor context:\n\`\`\`${language}\n${code}\n\`\`\`` }]
            }
          ],
          turnComplete: false
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendCRMContext(crmNotes: string, emailDraft: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: `[SYSTEM INJECTION: The candidate is typing their CRM notes and email. DO NOT respond or acknowledge this update out loud yet. Just keep it in mind.]\n\nCurrent CRM Notes:\n${crmNotes}\n\nCurrent Email Draft:\n${emailDraft}` }]
            }
          ],
          turnComplete: false
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendEmailSubmit(crmNotes: string, emailDraft: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const isNotesEmpty = !crmNotes || crmNotes.trim().length === 0;
      const cleanEmail = emailDraft.replace(/Subject:\s*\n*/i, '').trim();
      const isEmailEmpty = cleanEmail.length === 0;

      let promptText = `[SYSTEM NOTIFICATION: The candidate has officially SUBMITTED their email and CRM notes by clicking the 'Send' button.]\n\n`;
      promptText += `Final CRM Notes:\n${crmNotes || '(Empty)'}\n\n`;
      promptText += `Final Email:\n${emailDraft || '(Empty)'}\n\n`;

      if (isNotesEmpty && isEmailEmpty) {
        promptText += `[INSTRUCTION: Call out the candidate out loud for submitting completely blank notes and a blank email draft. Ask them why they didn't write anything. Show annoyance/disappointment in your voice.]`;
      } else if (isEmailEmpty) {
        promptText += `[INSTRUCTION: Call out the candidate for leaving the email draft completely empty, even if they wrote notes. Ask them to explain why they didn't draft the email.]`;
      } else {
        promptText += `[INSTRUCTION: The candidate has submitted their email/notes. Grade the email out loud to the candidate.]`;
      }

      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: promptText }]
            }
          ],
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendSlideContext(slideIndex: number, slideTitle: string) {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: `[SYSTEM INJECTION: The candidate has navigated to Slide ${slideIndex + 1} (${slideTitle}). DO NOT read the slide to them. Wait for them to explain it, or interrupt them if they are taking too long.]` }]
            }
          ],
          turnComplete: false
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendPitchStart() {
    if (!this.isSetupComplete) return;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text: `[SYSTEM INJECTION: The candidate clicked "Start Pitch Now". Acknowledge this quickly out loud (e.g., "Alright, let's hear your pitch", "Go ahead", etc.) and let them begin.]` }]
            }
          ],
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendHoldSilence() {
    this.sendText(`[SYSTEM INJECTION: You are putting the candidate on hold to transfer them. Say exactly "Please hold." and then IMMEDIATELY END YOUR TURN and remain completely silent. Do not speak again until the next system injection.]`);
  }

  sendRoleplayPromotion() {
    this.sendText(`[SYSTEM INJECTION: The hold transfer is complete. You are now the Decision Maker. Drop the Gatekeeper persona. Act with a very heavy, deep, authoritative, and impatient tone. Speak slowly and confidently. Start by saying something like: "Yeah, who is this?"]`);
  }

  sendRoleplayRejection() {
    this.sendText(`[SYSTEM INJECTION: The candidate failed the gatekeeper. Drop character and become the Interviewer/Coach. Give them one specific, actionable critique, then ask if they want to try again.]`);
  }

  sendRoleplayRetry() {
    this.sendText(`[SYSTEM INJECTION: The candidate is ready to retry. You are now the Gatekeeper again. Start the phone call.]`);
  }

  disconnect() {
    this.isSetupComplete = false;
    this.userBuffer = '';
    this.aiBuffer = '';
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
