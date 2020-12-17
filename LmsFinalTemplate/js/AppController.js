/* AppService Class-Complete */
class AppController
{
    constructor(playerViewModel, teamViewModel, listContainerId, formContainerId, apiUrl)
   {
        this.playerView = new PlayerView(playerViewModel, listContainerId, formContainerId, apiUrl)
        this.teamView = new TeamView(teamViewModel, listContainerId, formContainerId, apiUrl)
    }

    renderTeamListView()
   {
        this.teamView.renderList();
    }

    renderPlayerListView()
   {
        this.playerView.renderList();
   }
}