import create from "zustand";

const dataGridStore = create((set) => ({
  editHeaderStatus: false,
  setEditHeaderStatus: (editHeader) =>
    set(() => ({ editHeaderStatus: editHeader })),

  columnOrdersData: "",
  setColumnOrdersData: (columnOrder) =>
    set(() => ({ columnOrdersData: columnOrder })),

    

  isLoading: false,
  setIsLoading: (loading) => set(() => ({ isLoading: loading })),
}));

export { dataGridStore };
