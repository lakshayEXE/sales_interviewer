import type { FlowNodeData, NodeCategory } from '../types/flow';
import { NODE_CATEGORIES } from '../types/flow';

const GENERATION_PROMPT = `You are an expert interview designer. Given a Job Description (JD) and optionally a candidate's resume, generate a structured interview flow as a JSON array.

Each element in the array must be an object with these fields:
- "category": one of "greeting", "fundamentals", "dsa", "coding", "system-design", "behavioral", "custom", "wrapup"
- "label": a short name for the stage
- "description": a brief description of what this stage covers
- Plus category-specific fields:
  - greeting: "tone" ("formal"|"casual"), "durationHint" (string)
  - fundamentals: "subjects" (string[]), "depth" ("basic"|"intermediate"|"advanced")
  - dsa: "topics" (string[]), "difficulty" ("easy"|"medium"|"hard"), "allowHints" (boolean)
  - coding: "language" (string), "problemType" ("implement"|"debug"|"optimize")
  - system-design: "scope" ("HLD"|"LLD"|"both"), "exampleSystems" (string[])
  - behavioral: "focusAreas" (string[])
  - custom: "instructions" (string)
  - wrapup: "allowCandidateQuestions" (boolean)

Rules:
1. Always start with a "greeting" node and end with a "wrapup" node.
2. Analyze the JD to determine which technical areas to test.
3. If a resume is provided, cross-reference skills to find areas to probe deeper.
4. Choose appropriate difficulty based on the seniority level in the JD.
5. Generate 4-8 stages total (including greeting and wrapup).
6. Only output the JSON array. No markdown, no explanation.`;

const VALID_CATEGORIES: NodeCategory[] = ['greeting', 'research', 'roleplay', 'objection-handling', 'pitch', 'scenario', 'resume-review', 'custom', 'wrapup'];

function validateNode(node: any): FlowNodeData | null {
  if (!node || typeof node !== 'object') return null;
  if (!VALID_CATEGORIES.includes(node.category)) return null;
  if (!node.label || typeof node.label !== 'string') return null;

  const meta = NODE_CATEGORIES.find(c => c.category === node.category);
  if (!meta) return null;

  return { ...meta.defaultData, ...node } as FlowNodeData;
}

export async function generateFlowFromJD(
  apiKey: string,
  jd: string,
  resume: string
): Promise<FlowNodeData[]> {
  const textContext = (jd + " " + resume).toLowerCase();
  const isL2 = textContext.includes('l2') || textContext.includes('closer') || textContext.includes('account executive');

  if (isL2) {
    // L2 Flow: The Closer & Demo Expert
    return [
      { category: 'greeting', label: 'Introduction & SaaS Experience', description: 'Domain knowledge and market familiarity.', tone: 'formal', durationHint: '3 min' },
      { category: 'resume-review', label: 'Resume Deep Dive', description: 'Check for Ramp Trap, Metric Desert, Motion Mismatch, Title Inflation.', checkRampTrap: true, checkMetricDesert: true, checkMotionMismatch: true, checkTitleInflation: true },
      { category: 'roleplay', label: 'The Discovery Roleplay', description: 'Discovery questioning and active listening.', buyerPersona: 'Skeptical US-based client', scenarioContext: 'An L1 agent just passed me to you. I am interested in streamlining revenue operations.' },
      { category: 'pitch', label: 'Pitching the Demo', description: 'Value proposition delivery and booking the demo.', productFocus: 'Streamlining international payments', targetAudience: 'SaaS/FinTech client' },
      { category: 'scenario', label: 'The Stalled Deal Scenario', description: 'Pipeline management and follow-up strategy.', situation: 'You gave a great demo last week, but the client has gone cold and isn\'t replying to emails. Walk me through your exact cadence to re-engage them.' },
      { category: 'wrapup', label: 'Wrap-up', description: 'Closing and questions.', allowCandidateQuestions: true }
    ] as FlowNodeData[];
  } else {
    // L1 Flow: The Outbound Hunter (Default)
    return [
      { category: 'greeting', label: 'Introduction & Baseline Setup', description: 'Resilience and basic English communication.', tone: 'casual', durationHint: '2 min' },
      { category: 'resume-review', label: 'Resume Deep Dive', description: 'Check for Ramp Trap, Metric Desert, Motion Mismatch, Title Inflation.', checkRampTrap: true, checkMetricDesert: true, checkMotionMismatch: true, checkTitleInflation: true },
      { category: 'research', label: 'The Quick Research Test', description: 'R&D methodology and analytical thinking.', researchTarget: 'Mid-sized e-commerce store selling fitness gear', timeLimitSeconds: 30 },
      { category: 'roleplay', label: 'The Cold Call Roleplay', description: 'Pitch delivery and transition to payment plans.', buyerPersona: 'E-commerce store owner', scenarioContext: 'You are cold calling me. Ring ring... Hello, who is this?' },
      { category: 'objection-handling', label: 'The Objection Handling Node', description: 'Rebuttal skills and keeping prospect on line.', objection: 'Look, we already use a standard payment gateway and we aren\'t looking to change. We\'re too busy right now.', buyerPersona: 'E-commerce store owner' },
      { category: 'wrapup', label: 'Wrap-up', description: 'Closing and questions.', allowCandidateQuestions: true }
    ] as FlowNodeData[];
  }
}
