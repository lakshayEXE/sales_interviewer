import React from 'react';
import type { Node } from 'reactflow';
import { X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { FlowNodeData } from '../../types/flow';
import { NODE_CATEGORIES } from '../../types/flow';

interface NodeConfigPanelProps {
  node: Node;
  onUpdate: (id: string, data: Partial<FlowNodeData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const SelectField: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-textMuted mb-2">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const ToggleField: React.FC<{
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-semibold text-textMuted">{label}</label>
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-all relative ${checked ? 'bg-primary' : 'bg-gray-700'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${checked ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  </div>
);

function CategoryFields({ data, onUpdate, nodeId }: { data: FlowNodeData; onUpdate: (id: string, d: Partial<FlowNodeData>) => void; nodeId: string }) {
  switch (data.category) {
    case 'greeting':
      return (
        <>
          <SelectField
            label="Tone"
            value={data.tone}
            options={[{ value: 'formal', label: 'Formal' }, { value: 'casual', label: 'Casual' }]}
            onChange={v => onUpdate(nodeId, { tone: v as 'formal' | 'casual' } as any)}
          />
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Duration Hint</label>
            <input
              type="text"
              value={data.durationHint}
              onChange={e => onUpdate(nodeId, { durationHint: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. 2-3 min"
            />
          </div>
        </>
      );

    case 'research':
      return (
        <>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Research Target</label>
            <input
              type="text"
              value={data.researchTarget}
              onChange={e => onUpdate(nodeId, { researchTarget: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. E-commerce fitness gear store"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Time Limit (Seconds)</label>
            <input
              type="number"
              value={data.timeLimitSeconds}
              onChange={e => onUpdate(nodeId, { timeLimitSeconds: parseInt(e.target.value) || 30 } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
        </>
      );

    case 'roleplay':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Scenario Context</label>
            <textarea
              value={data.scenarioContext}
              onChange={e => onUpdate(nodeId, { scenarioContext: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[80px] resize-none"
              placeholder="e.g. Cold calling them for payment plans"
            />
          </div>
          <div className="pt-2 border-t border-gray-800">
            <ToggleField
              label="Enable Gatekeeper & Coaching Loop"
              checked={!!data.hasGatekeeper}
              onChange={v => onUpdate(nodeId, { hasGatekeeper: v } as any)}
            />
          </div>
          {data.hasGatekeeper ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-textMuted mb-2">Gatekeeper Persona</label>
                <input
                  type="text"
                  value={data.gatekeeperPersona || ''}
                  onChange={e => onUpdate(nodeId, { gatekeeperPersona: e.target.value } as any)}
                  className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g. Strict Executive Assistant"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textMuted mb-2">Decision Maker Persona</label>
                <input
                  type="text"
                  value={data.decisionMakerPersona || ''}
                  onChange={e => onUpdate(nodeId, { decisionMakerPersona: e.target.value } as any)}
                  className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="e.g. Busy CEO"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-textMuted mb-2">Buyer Persona</label>
              <input
                type="text"
                value={data.buyerPersona}
                onChange={e => onUpdate(nodeId, { buyerPersona: e.target.value } as any)}
                className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. Busy e-commerce owner"
              />
            </div>
          )}
        </div>
      );

    case 'objection-handling':
      return (
        <>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">The Objection</label>
            <textarea
              value={data.objection}
              onChange={e => onUpdate(nodeId, { objection: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[80px] resize-none"
              placeholder="e.g. We already use a standard payment gateway..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Buyer Persona</label>
            <input
              type="text"
              value={data.buyerPersona}
              onChange={e => onUpdate(nodeId, { buyerPersona: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. E-commerce owner"
            />
          </div>
        </>
      );

    case 'pitch':
      return (
        <>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Product Focus</label>
            <input
              type="text"
              value={data.productFocus}
              onChange={e => onUpdate(nodeId, { productFocus: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. Streamlining international payments"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Target Audience</label>
            <input
              type="text"
              value={data.targetAudience}
              onChange={e => onUpdate(nodeId, { targetAudience: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. SaaS/FinTech client"
            />
          </div>
        </>
      );

    case 'scenario':
      return (
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Situation</label>
          <textarea
            value={data.situation}
            onChange={e => onUpdate(nodeId, { situation: e.target.value } as any)}
            className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[100px] resize-none"
            placeholder="e.g. Client went cold after a great demo last week..."
          />
        </div>
      );

    case 'resume-review':
      return (
        <div className="space-y-4">
          <ToggleField
            label="Check Ramp Trap (Job Hopping)"
            checked={data.checkRampTrap}
            onChange={v => onUpdate(nodeId, { checkRampTrap: v } as any)}
          />
          <ToggleField
            label="Check Metric Desert"
            checked={data.checkMetricDesert}
            onChange={v => onUpdate(nodeId, { checkMetricDesert: v } as any)}
          />
          <ToggleField
            label="Check Motion Mismatch"
            checked={data.checkMotionMismatch}
            onChange={v => onUpdate(nodeId, { checkMotionMismatch: v } as any)}
          />
          <ToggleField
            label="Check Title Inflation"
            checked={data.checkTitleInflation}
            onChange={v => onUpdate(nodeId, { checkTitleInflation: v } as any)}
          />
        </div>
      );

    case 'email-followup':
      return (
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Time Limit (Minutes)</label>
          <input
            type="number"
            min={1}
            max={15}
            value={data.timeLimitMinutes}
            onChange={e => onUpdate(nodeId, { timeLimitMinutes: parseInt(e.target.value) || 3 } as any)}
            className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <p className="text-xs text-textMuted mt-2">
            The candidate will have this much time to write their mock CRM notes and follow-up email.
          </p>
        </div>
      );

    case 'presentation':
      return (
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Prep Time (Minutes)</label>
          <input
            type="number"
            min={0}
            max={10}
            value={data.prepTimeMinutes}
            onChange={e => onUpdate(nodeId, { prepTimeMinutes: parseInt(e.target.value) || 2 } as any)}
            className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
          <p className="text-xs text-textMuted mt-2">
            The candidate will have this much time to review the 3-slide deck before presenting.
          </p>
        </div>
      );

    case 'negotiation':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Buyer Persona</label>
            <input
              type="text"
              value={data.buyerPersona}
              onChange={e => onUpdate(nodeId, { buyerPersona: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. Aggressive Procurement Officer"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Product Name</label>
            <input
              type="text"
              value={data.productName}
              onChange={e => onUpdate(nodeId, { productName: e.target.value } as any)}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              placeholder="e.g. Enterprise License"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-textMuted mb-2">Target Price</label>
              <input
                type="text"
                value={data.targetPrice}
                onChange={e => onUpdate(nodeId, { targetPrice: e.target.value } as any)}
                className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. $50,000"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-textMuted mb-2">Floor Price</label>
              <input
                type="text"
                value={data.floorPrice}
                onChange={e => onUpdate(nodeId, { floorPrice: e.target.value } as any)}
                className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                placeholder="e.g. $40,000"
              />
            </div>
          </div>
        </div>
      );

    case 'custom':
      return (
        <div>
          <label className="block text-sm font-semibold text-textMuted mb-2">Custom Instructions</label>
          <textarea
            value={data.instructions}
            onChange={e => onUpdate(nodeId, { instructions: e.target.value } as any)}
            className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[120px] resize-none"
            placeholder="Write detailed instructions for this stage..."
          />
        </div>
      );

    case 'wrapup':
      return (
        <ToggleField
          label="Allow Candidate Questions"
          checked={data.allowCandidateQuestions}
          onChange={v => onUpdate(nodeId, { allowCandidateQuestions: v } as any)}
        />
      );

    default:
      return null;
  }
}

export const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onUpdate, onDelete, onClose }) => {
  const data = node.data as FlowNodeData;
  const meta = NODE_CATEGORIES.find(c => c.category === data.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-full md:w-96 shrink-0 h-full overflow-y-auto"
    >
      <Card className="h-full flex flex-col !p-0">
        <div className="pt-20 px-4 pb-4 border-b border-white/[0.06] flex justify-between items-center bg-surface">
          <div className="flex items-center gap-2">
            <span className="text-lg">{meta?.icon}</span>
            <h3 className="text-base font-bold text-white">Configure Stage</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDelete(node.id)}
              className="text-red-400 hover:text-red-300 transition-colors bg-background p-2 rounded-full"
              title="Delete stage"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-textMuted hover:text-white transition-colors bg-background p-2 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 flex-1 bg-surfaceHighlight/50">
          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Stage Name</label>
            <input
              type="text"
              value={data.label}
              onChange={e => onUpdate(node.id, { label: e.target.value })}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-textMuted mb-2">Description</label>
            <textarea
              value={data.description}
              onChange={e => onUpdate(node.id, { description: e.target.value })}
              className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all min-h-[80px] resize-none"
              placeholder="Brief description of this stage..."
            />
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="text-[10px] uppercase tracking-wider text-textMuted font-semibold mb-3">
              Category Settings
            </div>
            <div className="space-y-4">
              <CategoryFields data={data} onUpdate={onUpdate} nodeId={node.id} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
