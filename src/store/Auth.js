import create from "zustand";

const Auth = create((set) => ({
  isAuthenticate: false,
  setIsAuthenticate: (isAuth) => set(() => ({ isAuthenticate: isAuth })),
}));

export { Auth };
