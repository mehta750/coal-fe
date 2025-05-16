export const isDuplicateRawMaterial = (rawMaterials: any[], currentIndex: number) => {
    const currentId = rawMaterials[currentIndex].rawMaterial;
    return rawMaterials.some((rm, idx) => rm.rawMaterial === currentId && idx !== currentIndex);
  };
  
  export const getTotalPercentage = (materials: any[]) =>
    materials.reduce((acc, cur) => acc + Number(cur.productPercentage || 0), 0);
  
  export const createEmptyMaterialRow = () => ({
    rawMaterial: "",
    rawMaterialAvailableQuantity: null,
    dublicateRMError: null,
    productPercentage: "",
    error: null,
  });

  export default {
    isDuplicateRawMaterial,
    getTotalPercentage,
    createEmptyMaterialRow
  }
  
  