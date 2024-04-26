global.chrome = {
  tabs: {
    query: async () => {
      throw new Error("Unimplemented.");
    },
  },
  storage: {
    sync: {
      set: async (obj) => {
        throw new Error("Unimplemented");
      },
      get: async (obj) => {
        throw new Error("Unimplemented");
      },
    },
  },
};
