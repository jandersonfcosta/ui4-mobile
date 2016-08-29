/*
    UI4-Mobile 1.0.0
    Criado por Janderson Costa em 27/08/2016.
    Descrição: Interface gráfica para desenvolvimento de aplicações em dispositivo móvel.
    Dependências: Zepto ou jQuery

    Uso: ver demo.html
    Melhor uso com AngularJS
*/


function UI4(options) {
    // GLOBAL
    options = options ? options : {};
    options.activeTabIndex = options.activeTabIndex ? options.activeTabIndex : 0;

    var THIS = this,
        BODY = $("body"),
        NAVBAR = $(".navbar"),
        TABBAR = $(".tabbar"),
        OVERLAY, // compartilhado por todos os componentes
        SWIPE,
        showPopoverDelay = 100;
        closePopoverDelay = 200;
        closePanelDelay = 200;


    // EXECUÇÃO
    setNavbar();
    setTabbar();


    // WINDOW
    $(window).on("resize", function () {
        setNavbar();
        activeTab(options.activeTabIndex);

        // fecha overlay e elemento que estiver aberto
        if (OVERLAY.css("display") === "block")
            OVERLAY.click();
    });


    // OVERLAY
    BODY.append('<div class="overlay"></div>');
    OVERLAY = $(".overlay");


    // NAVBAR
    function setNavbar() {
        // define a largura do texto para que ocorra o efeito ellipsis...
        var buttons = NAVBAR.find(".button");
        NAVBAR.find(".center .text").width(window.innerWidth - buttons.length * buttons.width() - 20);
    }


    // SWIPE
    SWIPE = Swipe($(".swipe")[0], {
        callback: function(index, element) {
            // aba ativa
            activeTab(index);
        }
    });


    // TABBAR
    function setTabbar() {
        // aba ativa
        activeTab(options.activeTabIndex);

        TABBAR.find(".tab").off().on("click", function() {
            SWIPE.slide($(this).index());
        });
    }

    function activeTab(tabIndex) {
        var tabs = TABBAR.find(".tab"),
            tab = tabs.eq(tabIndex),
            bottomline = TABBAR.find(".bottomline");

        // aba ativa
        tabs.removeClass("active");
        tab.addClass("active");

        // linha inferior da aba
        var x = tab.position().left + TABBAR.scrollLeft();

        bottomline.css({
            width: tab.width(),
            left: x
        });

        // rola a tabbar
        if (options.activeTabIndex !== tabIndex) {
            if (TABBAR.scrollLeft() < x)
                animateScrollBarToRight(TABBAR, TABBAR.scrollLeft(), x);

            if (TABBAR.scrollLeft() > x)
                animateScrollBarToLeft(TABBAR, TABBAR.scrollLeft(), x);
        }

        options.activeTabIndex = tabIndex;
    }

    function animateScrollBarToRight(element, x1, x2) {
        if (x1 <= x2) setTimeout(function() {
            element.scrollLeft(x1 += 3);
            animateScrollBarToRight(element, x1, x2);
        }, 1);
    }

    function animateScrollBarToLeft(element, x1, x2) {
        if (x2 <= x1) setTimeout(function() {
            element.scrollLeft(x1 -= 3);
            animateScrollBarToLeft(element, x1, x2);
        }, 1);
    }


    // PANEL
    // abre ou fecha o painel
    this.togglePanel = togglePanel;
    function togglePanel(panelId) {
        var panel = panelId ? $("#" + panelId) : $(".panel").eq(0);

        // abrir
        panel.toggleClass("closed opened");

        // fechar
        // todos os elementos filhos de panel definidos com a classe .close podem fechar painel
        $(".panel .close").off().on("mouseup", function() {
            setTimeout(function() {
                OVERLAY.click();
            }, closePanelDelay);
        });

        // overlay
        OVERLAY.off().on("click", function() {
            // fechar
            $(this).hide();
            panel.toggleClass("closed opened");
        }).show();
    }


    // POPOVER
    this.showPopover = showPopover;
    function showPopover(popoverId, trigger) {
        var popover = popoverId ? $("#" + popoverId) : $(".popover").eq(0),
            margin = 6;

        options.popover = popover;

        // abrir
        setTimeout(function() {
            popover.toggleClass("closed opened").css({
                top: $(trigger).position().top + margin,
                left: $(trigger).position().left - popover.width() + $(trigger).width() - margin
            });

            // fechar
            OVERLAY.off().on("click", function() {
                $(this).hide();
                popover.toggleClass("closed opened");
            }).show();
        }, showPopoverDelay);

        // fechar
        // todos os elementos filhos de popover definidos com a classe .item podem fechar popover
        popover.find(".item").off().on("mouseup", function() {
            setTimeout(function() {
                OVERLAY.click();
            }, closePopoverDelay);
        });
    }
}
