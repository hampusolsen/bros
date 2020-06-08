export function createDashboardLayer(font, playerEnvironment) {
    const L1 = font.size;
    const L2 = font.size * 2;

    const coins = 13;

    return function drawDashboard(context) {
        const { score, time } = playerEnvironment.playerController;

        font.print('MARIO', context, 16, L1);
        font.print(score.toString().padStart(6, '0'), context, 16, L2);

        font.print('@x' + coins.toString().padStart(2, '0'), context, 96, L2);

        font.print('WORLD', context, 152, L1);
        font.print('1-1', context, 160, L2);

        font.print('TIME', context, 208, L1);
        font.print(time.toFixed().toString().padStart(3, '0'), context, 216, L2);
    }
}