import type { FlowNodeData } from '../types/flow';






export async function generateFlowFromJD(
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
      { category: 'roleplay', label: 'The Discovery Roleplay', description: 'Discovery questioning and active listening.', buyerPersona: 'Skeptical US-based client', scenarioContext: 'An L1 agent just passed me to you. I am interested in streamlining revenue operations.', hasGatekeeper: true, gatekeeperPersona: 'Strict Executive Assistant', decisionMakerPersona: 'Skeptical US-based client' },
      { category: 'presentation', label: 'Credee Pitch Deck', description: 'Present the Credee solution and handle objections.', prepTimeMinutes: 2 },
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
      { category: 'roleplay', label: 'The Cold Call Roleplay', description: 'Pitch delivery and transition to payment plans.', buyerPersona: 'E-commerce store owner', scenarioContext: 'You are cold calling me. Ring ring... Hello, who is this?', hasGatekeeper: true, gatekeeperPersona: 'Strict Executive Assistant', decisionMakerPersona: 'E-commerce store owner' },
      { category: 'objection-handling', label: 'The Objection Handling Node', description: 'Rebuttal skills and keeping prospect on line.', objection: 'Look, we already use a standard payment gateway and we aren\'t looking to change. We\'re too busy right now.', buyerPersona: 'E-commerce store owner' },
      { category: 'wrapup', label: 'Wrap-up', description: 'Closing and questions.', allowCandidateQuestions: true }
    ] as FlowNodeData[];
  }
}
