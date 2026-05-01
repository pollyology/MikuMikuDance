export default class ScoreHandler
{
    constructor()
    {
        this.score = 0;
        this.text = document.getElementById("score");
    }

    add(amount)
    {
        this.score += amount;
        this.update();
    }

    update()
    {
        if (this.text)
        {
            this.text.textContent = `${this.score}`;
        }
    }
}

export const scoreHandler = new ScoreHandler();