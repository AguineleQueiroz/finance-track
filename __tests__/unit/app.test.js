describe('Application Tests', () => {
    it('should return a status code of 200 for the home page', async () => {
        const response = await fetch('http://127.0.0.1:5500/src/static/home.html');
        expect(response.status).toBe(200);
    });
});