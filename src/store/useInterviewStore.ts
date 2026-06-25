import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Edge } from 'reactflow';
import type { TranscriptItem } from '../components/TranscriptSidebar';
import type { CompanyInfo, InterviewerConfig } from '../types/flow';
import { DEFAULT_COMPANY_INFO, DEFAULT_INTERVIEWER_CONFIG } from '../types/flow';
import type { EvaluationResult } from '../types/evaluation';
import type { ProctorEvent } from '../types/proctor';

export interface FlowNavActions {
  onCompanyInfo: () => void;
  onInterviewerConfig: () => void;
  onGenerateLink: () => void;
}

export interface CandidateCode {
  code: string;
  language: string;
}

export interface InterviewStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[] | ((val: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((val: Edge[]) => Edge[])) => void;
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  interviewerConfig: InterviewerConfig;
  setInterviewerConfig: (config: InterviewerConfig) => void;
  transcript: TranscriptItem[];
  addTranscriptItem: (item: TranscriptItem) => void;
  clearTranscript: () => void;
  /** Extracted text of the candidate's uploaded resume (not persisted across sessions). */
  resumeText: string;
  setResumeText: (text: string) => void;
  clearResumeText: () => void;
  candidateCode: CandidateCode;
  setCandidateCode: (code: string, language: string) => void;
  clearCandidateCode: () => void;
  // Starter code the interviewer loaded for debug/optimize tasks (for comparison at evaluation).
  originalCode: CandidateCode;
  setOriginalCode: (code: string, language: string) => void;
  clearOriginalCode: () => void;
  crmNotes: string;
  setCRMNotes: (notes: string) => void;
  emailDraft: string;
  setEmailDraft: (draft: string) => void;
  clearCRMContext: () => void;
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  /** Snapshot of the stages used in the most recent live session (may come from an invite link). */
  sessionNodes: Node[];
  setSessionNodes: (nodes: Node[]) => void;
  evaluation: EvaluationResult | null;
  setEvaluation: (evaluation: EvaluationResult | null) => void;
  proctorEvents: ProctorEvent[];
  addProctorEvent: (event: ProctorEvent) => void;
  clearProctorEvents: () => void;
  isSessionActive: boolean;
  setSessionActive: (active: boolean) => void;
  flowNavActions: FlowNavActions | null;
  setFlowNavActions: (actions: FlowNavActions | null) => void;
}

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 50 }, data: { category: 'greeting', label: 'Introduction & Baseline Setup', description: 'Resilience and basic English communication.', tone: 'casual', durationHint: '2 min' } },
  { id: '2', type: 'custom', position: { x: 250, y: 180 }, data: { category: 'resume-review', label: 'Resume Deep Dive', description: 'Check for Ramp Trap, Metric Desert, Motion Mismatch, Title Inflation.', checkRampTrap: true, checkMetricDesert: true, checkMotionMismatch: true, checkTitleInflation: true } },
  { id: '3', type: 'custom', position: { x: 250, y: 310 }, data: { category: 'research', label: 'The Quick Research Test', description: 'R&D methodology and analytical thinking.', researchTarget: 'Mid-sized e-commerce store selling fitness gear', timeLimitSeconds: 30 } },
  { id: '4', type: 'custom', position: { x: 250, y: 440 }, data: { category: 'roleplay', label: 'The Cold Call Roleplay', description: 'Pitch delivery and transition to payment plans.', buyerPersona: 'E-commerce store owner', scenarioContext: 'You are cold calling me. Ring ring... Hello, who is this?' } },
  { id: '5', type: 'custom', position: { x: 250, y: 570 }, data: { category: 'objection-handling', label: 'The Objection Handling Node', description: 'Rebuttal skills and keeping prospect on line.', objection: 'Look, we already use a standard payment gateway and we aren\'t looking to change. We\'re too busy right now.', buyerPersona: 'E-commerce store owner' } },
  { id: '6', type: 'custom', position: { x: 250, y: 700 }, data: { category: 'wrapup', label: 'Wrap-up', description: 'Closing and questions.', allowCandidateQuestions: true } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#38bdf8' } },
];

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      setApiKey: (key) => set({ apiKey: key }),
      nodes: initialNodes,
      edges: initialEdges,
      setNodes: (nodes) => set((state) => ({ nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes })),
      setEdges: (edges) => set((state) => ({ edges: typeof edges === 'function' ? edges(state.edges) : edges })),
      companyInfo: DEFAULT_COMPANY_INFO,
      setCompanyInfo: (info) => set({ companyInfo: info }),
      interviewerConfig: DEFAULT_INTERVIEWER_CONFIG,
      setInterviewerConfig: (config) => set({ interviewerConfig: config }),
      transcript: [],
      addTranscriptItem: (item) => set((state) => ({ transcript: [...state.transcript, item] })),
      clearTranscript: () => set({ transcript: [] }),
      resumeText: '',
      setResumeText: (text) => set({ resumeText: text }),
      clearResumeText: () => set({ resumeText: '' }),
      candidateCode: { code: '', language: '' },
      setCandidateCode: (code, language) => set({ candidateCode: { code, language } }),
      clearCandidateCode: () => set({ candidateCode: { code: '', language: '' } }),
      originalCode: { code: '', language: '' },
      setOriginalCode: (code, language) => set({ originalCode: { code, language } }),
      clearOriginalCode: () => set({ originalCode: { code: '', language: '' } }),
      crmNotes: '',
      setCRMNotes: (notes) => set({ crmNotes: notes }),
      emailDraft: '',
      setEmailDraft: (draft) => set({ emailDraft: draft }),
      clearCRMContext: () => set({ crmNotes: '', emailDraft: '' }),
      currentSlideIndex: 0,
      setCurrentSlideIndex: (index) => set({ currentSlideIndex: index }),
      sessionNodes: [],
      setSessionNodes: (nodes) => set({ sessionNodes: nodes }),
      evaluation: null,
      setEvaluation: (evaluation) => set({ evaluation }),
      proctorEvents: [],
      addProctorEvent: (event) => set((state) => ({ proctorEvents: [...state.proctorEvents, event] })),
      clearProctorEvents: () => set({ proctorEvents: [] }),
      isSessionActive: false,
      setSessionActive: (active) => set({ isSessionActive: active }),
      flowNavActions: null,
      setFlowNavActions: (actions) => set({ flowNavActions: actions }),
    }),
    {
      name: 'interview_session',
      partialize: (state) => ({
        apiKey: state.apiKey,
        nodes: state.nodes,
        edges: state.edges,
        companyInfo: state.companyInfo,
        interviewerConfig: state.interviewerConfig,
      }),
    }
  )
);
