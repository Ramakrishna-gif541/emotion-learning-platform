import React from 'react';

const EMOTION_EMOJI = { happy:'😄', focus:'🎯', bored:'😴', confused:'😕', frustrated:'😤', neutral:'😐' };
const EMOTION_COLOR = { happy:'#27ae60', focus:'#5b4cff', bored:'#f39c12', confused:'#e74c3c', frustrated:'#e67e22', neutral:'#95a5a6' };

export default function EmotionBadge({ emotion = 'neutral', size = 'md' }) {
  const padding  = size === 'lg' ? '8px 20px' : '4px 12px';
  const fontSize = size === 'lg' ? 16 : 13;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: EMOTION_COLOR[emotion] || '#95a5a6',
      color: '#fff', padding, borderRadius: 20,
      fontSize, fontWeight: 600, textTransform: 'capitalize',
    }}>
      {EMOTION_EMOJI[emotion] || '😐'} {emotion}
    </span>
  );
}
