export const VERDICT_STYLES = {
  'GENUINE': {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
    label: 'Genuine'
  },
  'GENUINE COPY': {
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: '📄',
    label: 'Genuine Copy'
  },
  'ALTERED': {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: '⚠️',
    label: 'Altered'
  },
  'FORGED': {
    color: 'bg-red-200 text-red-900 border-red-300',
    icon: '❌',
    label: 'Forged'
  },
  'UNVERIFIABLE': {
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '❓',
    label: 'Unverifiable'
  },
  'REVOKED': {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🛑',
    label: 'Revoked'
  },
  'EXPIRED': {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '⏱️',
    label: 'Expired'
  }
};

export const getVerdictStyle = (verdict) => {
  return VERDICT_STYLES[verdict] || VERDICT_STYLES['UNVERIFIABLE'];
};
