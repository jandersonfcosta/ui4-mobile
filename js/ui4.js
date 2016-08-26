var ui4 = new UI4();

function UI4() {
    // PANEL ---------------------------------------------------------------------------------

    // abre ou fecha o painel
    this.togglePanel = togglePanel;
    function togglePanel(panelId) {
        var panel = panelId ? $("#" + panelId) : $(".panel").eq(0);
        panel.toggleClass("closed opened");
    }

    // fechar painel
    // descrição: todos os elementos filhos de panel definidos com a classe close podem fechar o painel
    $(".panel .close").on("click", function() {
        // oculta overlay e painel
        $(".overlay").click();
    });
}
