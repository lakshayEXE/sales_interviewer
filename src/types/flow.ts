export type NodeCategory =
  | 'greeting'
  | 'research'
  | 'roleplay'
  | 'objection-handling'
  | 'pitch'
  | 'scenario'
  | 'resume-review'
  | 'email-followup'
  | 'presentation'
  | 'custom'
  | 'wrapup';

export interface BaseNodeData {
  category: NodeCategory;
  label: string;
  description: string;
}

export interface GreetingNodeData extends BaseNodeData {
  category: 'greeting';
  tone: 'formal' | 'casual';
  durationHint: string;
}

export interface ResearchNodeData extends BaseNodeData {
  category: 'research';
  researchTarget: string;
  timeLimitSeconds: number;
}

export interface RoleplayNodeData extends BaseNodeData {
  category: 'roleplay';
  buyerPersona: string;
  scenarioContext: string;
}

export interface ObjectionHandlingNodeData extends BaseNodeData {
  category: 'objection-handling';
  objection: string;
  buyerPersona: string;
}

export interface PitchNodeData extends BaseNodeData {
  category: 'pitch';
  productFocus: string;
  targetAudience: string;
}

export interface ResumeReviewNodeData extends BaseNodeData {
  category: 'resume-review';
  checkRampTrap: boolean;
  checkMetricDesert: boolean;
  checkMotionMismatch: boolean;
  checkTitleInflation: boolean;
}

export interface ScenarioNodeData extends BaseNodeData {
  category: 'scenario';
  situation: string;
}

export interface EmailFollowupNodeData extends BaseNodeData {
  category: 'email-followup';
  timeLimitMinutes: number;
}

export interface PresentationNodeData extends BaseNodeData {
  category: 'presentation';
  prepTimeMinutes: number;
}

export interface CustomNodeData extends BaseNodeData {
  category: 'custom';
  instructions: string;
}

export interface WrapupNodeData extends BaseNodeData {
  category: 'wrapup';
  allowCandidateQuestions: boolean;
}

export type FlowNodeData =
  | GreetingNodeData
  | ResearchNodeData
  | RoleplayNodeData
  | ObjectionHandlingNodeData
  | PitchNodeData
  | ScenarioNodeData
  | ResumeReviewNodeData
  | EmailFollowupNodeData
  | PresentationNodeData
  | CustomNodeData
  | WrapupNodeData;

export interface CompanyInfo {
  name: string;
  description: string;
  techStack: string[];
  roleTitle: string;
  additionalContext: string;
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: '',
  description: '',
  techStack: [],
  roleTitle: '',
  additionalContext: '',
};

export type InterviewerDemeanor = 'friendly' | 'balanced' | 'strict';

export interface InterviewerConfig {
  demeanor: InterviewerDemeanor;
  customInstructions: string;
  voiceName: string;
  languageCode: string;
}

export const DEFAULT_INTERVIEWER_CONFIG: InterviewerConfig = {
  demeanor: 'friendly',
  customInstructions: '',
  voiceName: 'Kore',
  languageCode: 'en-IN',
};

export interface DemeanorPresetMeta {
  id: InterviewerDemeanor;
  label: string;
  icon: string;
  description: string;
}

export const DEMEANOR_PRESETS: DemeanorPresetMeta[] = [
  {
    id: 'friendly',
    label: 'Friendly & Supportive',
    icon: '😊',
    description: 'Warm, encouraging and patient. Offers hints and puts the candidate at ease.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    icon: '⚖️',
    description: 'Professional and neutral. Fair and direct, hints only after a real attempt.',
  },
  {
    id: 'strict',
    label: 'Strict & Challenging',
    icon: '🎯',
    description: 'Rigorous with a high bar. Probes deeply and rarely gives hints.',
  },
];

export interface VoiceOption {
  name: string;
  label: string;
  gender: 'female' | 'male';
}

export const INTERVIEWER_VOICES: VoiceOption[] = [
  { name: 'Kore', label: 'Kore', gender: 'female' },
  { name: 'Aoede', label: 'Aoede', gender: 'female' },
  { name: 'Leda', label: 'Leda', gender: 'female' },
  { name: 'Zephyr', label: 'Zephyr', gender: 'female' },
  { name: 'Callirrhoe', label: 'Callirrhoe', gender: 'female' },
  { name: 'Puck', label: 'Puck', gender: 'male' },
  { name: 'Orus', label: 'Orus', gender: 'male' },
  { name: 'Charon', label: 'Charon', gender: 'male' },
];

export interface VoiceLanguageOption {
  code: string;
  label: string;
}

export const VOICE_LANGUAGES: VoiceLanguageOption[] = [
  { code: 'en-IN', label: 'English (Indian accent)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'es-US', label: 'Spanish (US)' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'de-DE', label: 'German (Germany)' },
];

export interface NodeCategoryMeta {
  category: NodeCategory;
  label: string;
  icon: string;
  shortDesc?: string;
  color: string;
  group: 'start-end' | 'technical' | 'soft-skills' | 'other';
  defaultData: FlowNodeData;
}

export const NODE_CATEGORIES: NodeCategoryMeta[] = [
  {
    category: 'greeting',
    label: 'Greeting',
    icon: '👋',
    shortDesc: 'Warm intro and ice breakers',
    color: '#4ade80',
    group: 'start-end',
    defaultData: {
      category: 'greeting',
      label: 'Greeting',
      description: 'Introduction and ice breakers',
      tone: 'formal',
      durationHint: '2-3 min',
    },
  },
  {
    category: 'resume-review',
    label: 'Resume Review',
    icon: '📄',
    shortDesc: 'Hunt for sales red flags',
    color: '#ef4444',
    group: 'technical',
    defaultData: {
      category: 'resume-review',
      label: 'Resume Deep Dive',
      description: 'Check for Ramp Trap, Metric Desert, Motion Mismatch, Title Inflation.',
      checkRampTrap: true,
      checkMetricDesert: true,
      checkMotionMismatch: true,
      checkTitleInflation: true,
    },
  },
  {
    category: 'research',
    label: 'Quick Research',
    icon: '🔍',
    shortDesc: 'Test R&D methodology',
    color: '#60a5fa',
    group: 'technical',
    defaultData: {
      category: 'research',
      label: 'Quick Research Test',
      description: 'Find info quickly',
      researchTarget: 'E-commerce fitness gear store',
      timeLimitSeconds: 30,
    },
  },
  {
    category: 'roleplay',
    label: 'Roleplay',
    icon: '📞',
    shortDesc: 'Interactive cold call or discovery',
    color: '#f472b6',
    group: 'technical',
    defaultData: {
      category: 'roleplay',
      label: 'Cold Call Roleplay',
      description: 'Interactive cold call simulation',
      buyerPersona: 'Busy e-commerce owner',
      scenarioContext: 'Cold calling them for payment plans',
    },
  },
  {
    category: 'objection-handling',
    label: 'Objection Handling',
    icon: '🛡️',
    shortDesc: 'Overcome objections',
    color: '#a78bfa',
    group: 'soft-skills',
    defaultData: {
      category: 'objection-handling',
      label: 'Objection Handling',
      description: 'Handling common objections',
      objection: 'We already use a standard payment gateway and we aren\'t looking to change.',
      buyerPersona: 'E-commerce owner',
    },
  },
  {
    category: 'pitch',
    label: 'Pitching',
    icon: '🗣️',
    shortDesc: 'Deliver value prop and demo',
    color: '#fb923c',
    group: 'technical',
    defaultData: {
      category: 'pitch',
      label: 'Pitch the Demo',
      description: 'Pitch value prop and book demo',
      productFocus: 'Streamlining international payments',
      targetAudience: 'SaaS/FinTech client',
    },
  },
  {
    category: 'scenario',
    label: 'Scenario',
    icon: '🧠',
    shortDesc: 'Situational pipeline management',
    color: '#facc15',
    group: 'soft-skills',
    defaultData: {
      category: 'scenario',
      label: 'Stalled Deal Scenario',
      description: 'Manage a stalled deal in pipeline',
      situation: 'Client went cold after a great demo last week. How to follow up?',
    },
  },
  {
    category: 'custom',
    label: 'Custom Stage',
    icon: '✏️',
    shortDesc: 'Your own freeform stage',
    color: '#94a3b8',
    group: 'other',
    defaultData: {
      category: 'custom',
      label: 'Custom Stage',
      description: '',
      instructions: '',
    },
  },
  {
    category: 'email-followup',
    label: 'Email Follow-Up',
    icon: '✉️',
    shortDesc: 'Write follow-up email to prospect',
    color: '#8b5cf6',
    group: 'sales',
    defaultData: {
      category: 'email-followup',
      label: 'Email Follow-Up',
      description: 'Candidate writes a follow-up email and logs CRM notes based on the prior call.',
      timeLimitMinutes: 3,
    },
  },
  {
    category: 'presentation',
    label: 'Pitch Deck',
    icon: '🖥️',
    shortDesc: 'Interactive slide presentation',
    color: '#f97316',
    group: 'sales',
    defaultData: {
      category: 'presentation',
      label: 'Credee Pitch Deck',
      description: 'Candidate presents a 3-slide pitch deck.',
      prepTimeMinutes: 2,
    },
  },
  {
    category: 'wrapup',
    label: 'Wrap-up',
    icon: '🎬',
    shortDesc: 'Closing and candidate Q&A',
    color: '#2dd4bf',
    group: 'start-end',
    defaultData: {
      category: 'wrapup',
      label: 'Wrap-up',
      description: 'Closing and candidate questions',
      allowCandidateQuestions: true,
    },
  },
];

export const FUNDAMENTALS_SUBJECTS = [
  'OOPs', 'DBMS', 'Operating Systems', 'Computer Networks',
  'Software Engineering', 'Compiler Design', 'Theory of Computation',
];

export const DSA_TOPICS = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues',
  'Trees', 'Graphs', 'Dynamic Programming', 'Greedy',
  'Hashing', 'Sorting & Searching', 'Recursion', 'Bit Manipulation',
];

export const BEHAVIORAL_AREAS = [
  'Leadership', 'Conflict Resolution', 'Teamwork',
  'Communication', 'Problem Solving', 'Adaptability',
  'Time Management', 'Decision Making',
];
