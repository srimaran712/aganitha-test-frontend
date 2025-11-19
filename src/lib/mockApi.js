export const mockApi = {
  async getHealth() {
    // Fake network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const startTime = Date.now() - 1000 * 60 * 60 * 5; // pretend 5h uptime
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    return {
      ok: true,
      version: "1.0.0",
      uptime: uptimeSeconds,
      checkedAt: new Date().toISOString(),
    };
  },
};
