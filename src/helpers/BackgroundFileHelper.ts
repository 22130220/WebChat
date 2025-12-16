export const getFileBg = (type: string): string => {
  switch (type) {
    case 'PDF':
      return 'bg-red-50';
    case 'PNG':
      return 'bg-green-50';
    case 'DOC':
      return 'bg-blue-50';
    default:
      return 'bg-purple-50';
  }
};
