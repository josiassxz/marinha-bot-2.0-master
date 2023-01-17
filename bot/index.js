const puppeteer = require("puppeteer");
const readXlsxFile = require("read-excel-file/node");

// ** variaveis ** //
//#region
const selectOrgMilitar =
  "#q-app > div.container > div.q-layout > div.layout-view > div > div.row.gutter-xs > div.col-md-12.col-xs-12 > div > div.q-if-inner.col.column.q-popup--skip > div > div";
const btnAgendamento =
  "#q-app > div.container > div.q-layout > div.layout-view > div > div.acoesHome > div:nth-child(2) > div > div.q-item.q-item-division.relative-position > div.q-item-main.q-item-section > div";
const btnAgendar =
  "#q-app > div.container > div.q-layout > div.layout-view > div > div.acoesHome > div.q-collapsible.q-item-division.relative-position.titleacord.user.q-collapsible-opened.q-collapsible-cursor-pointer > div > div:nth-child(2) > div > div > p:nth-child(2) > button > div.q-btn-inner.row.col.items-center.q-popup--skip.justify-center";
const btnGru =
  "#geral > div:nth-child(4) > div.q-tabs.flex.no-wrap.overflow-hidden.q-tabs-position-top.q-tabs-inverted > div.q-tabs-head.row.q-tabs-align-left.text-primary > div.q-tabs-scroller.row.no-wrap > div:nth-child(2)";
const btnAddServico =
  "#geral > div:nth-child(4) > div:nth-child(2) > button > div.q-btn-inner.row.col.items-center.q-popup--skip.justify-center";
const capitaniaBrasilia = "text/Capitania Fluvial de Brasília";
const capitaniaGoias = "text/Capitania Fluvial de Goiás";
const btnTermos = "#checkorientacoes > div > i:nth-child(3)";
const firstProximoBtn =
  "#q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom.only-next > div > div.stepper-button.next";
const selectCPF = "#tipoSelectInteressado";
const btnSelecionarGrupo =
  "#geral > div:nth-child(4) > div.q-tabs.flex.no-wrap.overflow-hidden.q-tabs-position-top.q-tabs-inverted > div.q-tabs-panes > div > div > div > div > div.tdfristserv.col-md-4.col-xs-12 > div > div > div > div.q-if.row.no-wrap.relative-position.q-select.groupSelect.q-if-has-label.q-if-focusable.q-if-inverted.q-if-has-content.bg-white.text-white > div.q-if-inner.col.column.q-popup--skip > div.row.no-wrap.relative-position > div.col.q-input-target.ellipsis.justify-start";
const btnEducacional =
  "body > div.q-popover.scroll.column.no-wrap.animate-popup-down > div > div:nth-child(3) > div > div";
const btnCardeneta =
  "#geral > div:nth-child(4) > div.q-tabs.flex.no-wrap.overflow-hidden.q-tabs-position-top.q-tabs-inverted > div.q-tabs-panes > div > div > div > div > div.col-md-7.col-xs-12 > div > div > div > div.q-if.row.no-wrap.relative-position.q-select.servSelectGroup.q-if-has-label.q-if-focusable.q-if-inverted.q-if-has-content.bg-white.text-white > div.q-if-inner.col.column.q-popup--skip > div.row.no-wrap.relative-position > div.col.q-input-target.ellipsis.justify-start";
const btnProximo =
  "#q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom > div > div.stepper-button.next";
const btnHoraManha =
  "#geral > div.row.gutter-xs > div.col-md-8 > div > div > div.row.xs-gutter > div:nth-child(1) > div > div > div > div > div > div:nth-child(1) > div > div > i.q-icon.q-radio-checked.cursor-pointer.absolute-full.material-icons";
const btnHoraTarde =
  "#geral > div.row.gutter-xs > div.col-md-8 > div > div > div.row.xs-gutter > div:nth-child(2) > div > div > div > div > div > div:nth-child(1) > div > div > i.q-icon.q-radio-unchecked.cursor-pointer.absolute-full.material-icons";
const btnDataDisponivel =
  "#geral > div.row.gutter-xs > div.col-md-4 > div > div > div.__vev_calendar-wrapper > div.cal-wrapper > div.cal-body > div.dates > div.item.event";
const tabelaHoras = "#geral > div.row.gutter-xs > div.col-md-8 > div > div";

//#endregion

// adicionar delay
function waitFor(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function robo() {
  const clientes = await Promise.all(
    await readXlsxFile("./bot/customers.xlsx")
  );

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  for (const cliente of clientes) {
    const cpfCliente = cliente[0];
    const estadoCliente = cliente[1];
    const gruCliente = cliente[2];

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto("https://sistemas.dpc.mar.mil.br/sisap/agendamento/#/");

    // esperar e clicar no campo
    await page.waitForSelector(selectOrgMilitar);
    await page.click(selectOrgMilitar);

    // esperar opcao
    await waitFor(300);

    //* seleciona o estado de acordo com o cliente
    if (estadoCliente === "DF") {
      await page.waitForSelector(capitaniaBrasilia);
      await page.click(capitaniaBrasilia);
    } else {
      await page.waitForSelector(capitaniaGoias);
      await page.click(capitaniaGoias);
    }

    // btn agendamento
    await page.waitForSelector(btnAgendamento);
    await page.click(btnAgendamento);
    await waitFor(200);

    // clique para agendar

    await page.waitForSelector(btnAgendar);
    await page.click(btnAgendar);
    await waitFor(1900);

    if (
      ((await page.$(
        "body > div.modal.fullscreen.row.minimized.flex-center > div.modal-content"
      )) &&
        (await page.$(
          "body > div.modal.fullscreen.row.minimized.flex-center > div.modal-content > div.modal-header"
        ))) !== null // se nao tiver horario
    ) {
      continue;
    }

    // concordo com os termos
    await page.waitForSelector(btnTermos);
    await page.click(btnTermos);

    // first proximo btn
    await page.waitForSelector(firstProximoBtn);
    await page.click(firstProximoBtn);

    // clicar no selecione CPF
    await page.waitForSelector(selectCPF);
    await page.click(selectCPF);

    // clicar no CPF
    await page.waitForSelector(
      "body > div.q-popover.scroll.column.no-wrap.animate-popup-down > div"
    );

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await waitFor(100);

    // digitar CPF
    await page.type("#cpfcnpjInteressado", `------${cpfCliente}`, {
      delay: 20,
    });

    // proximo
    await page.click(
      "#q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom > div > div.stepper-button.next"
    );

    // COM GRU

    await page.waitForSelector("text/Com GRU");
    await page.click("text/Com GRU");

    await page.waitForSelector("text/Adicionar Serviço");
    await page.click("text/Adicionar Serviço");

    await page.waitForSelector("text/Informe nº da GRU");
    await page.click("text/Informe nº da GRU");

    await page.type("text/Informe nº da GRU", `${gruCliente}`);

    await page.waitForSelector("text/Selecione o serviço desejado.");
    await page.click("text/Selecione o serviço desejado.");

    const tituloInscricaoEmbarcacaoRenovacao =
      "text/ TITULO DE INSCRICAO DE EMBARCACAO (TIE/TIEM) - RENOVAÇÃO ";

    const tituloInscricaoEmbarcacao = "";

    await waitFor(300);
    await page.waitForSelector(tituloInscricaoEmbarcacaoRenovacao);
    await page.click(tituloInscricaoEmbarcacaoRenovacao);

    // // SEM GRU
    // await page.waitForSelector(btnGru);
    // await page.click(btnGru);

    // // add servico
    // await page.waitForSelector(btnAddServico);
    // await page.click(btnAddServico);

    // // selecionar grupo
    // await page.waitForSelector(btnSelecionarGrupo);
    // await page.click(btnSelecionarGrupo);
    // await waitFor(300);

    // // educacional
    // await page.waitForSelector(btnEducacional);
    // await page.click(btnEducacional);

    // // cardeneta
    // await page.waitForSelector(btnCardeneta);
    // await page.click(btnCardeneta);
    // await waitFor(300);

    // await page.waitForSelector(
    //   "body > div.q-popover.scroll.column.no-wrap.animate-popup-up > div"
    // );

    // await page.click(
    //   "body > div.q-popover.scroll.column.no-wrap.animate-popup-up > div > div:nth-child(4) > div > div"
    // );

    // // proximo
    // await page.click(btnProximo);

    // // calendario DIA
    // await page.waitForSelector(
    //   "#geral > div.row.gutter-xs > div.col-md-4 > div > div"
    // );

    // await page.waitForSelector(btnDataDisponivel);

    // await page.click(btnDataDisponivel);
    // await waitFor(200);

    // // HORA
    // await page.waitForSelector(
    //   "#geral > div.row.gutter-xs > div.col-md-8 > div > div"
    // );

    // await page.keyboard.press("Tab");
    // await waitFor(50);
    // await page.keyboard.press("Enter");
  }

  // await browser.close();

  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // if ((await page.$(btnHoraManha)) !== null) {
  //   await waitFor(200);
  //   await page.click(btnHoraManha);
  // } else {
  //   await waitFor(200);
  //   await page.waitForSelector(btnHoraTarde);
  //   await page.click(btnHoraTarde);
  // }

  // await page.click(btnProximo);

  // await page.waitForSelector(
  //   "#q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom > div > div.stepper-button.next > span"
  // );

  // await page.click(
  //   "#q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom > div > div.stepper-button.next > span"
  // );

  // #q-app > div.container > div.q-layout > div.layout-view > div > div.borderGeralEtapa > div.stepper-box > div.bottom > div > div.stepper-button.next > span

  // // clicar no aceito termos
  // await page.waitForSelector("#checkorientacoes > div > i:nth-child(3)");
  // await page.click("#checkorientacoes > div > i:nth-child(3)");
}
robo();
