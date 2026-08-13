const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");


const criacao =
    document.getElementById("criacao");

const forma =
    document.getElementById("forma");

const abrirVertices =
    document.getElementById("abrirVertices");

const painelVertices =
    document.getElementById("painelVertices");

const quantidadeVertices =
    document.getElementById("quantidadeVertices");

const confirmarVertices =
    document.getElementById("confirmarVertices");

const cancelarVertices =
    document.getElementById("cancelarVertices");

const formaCustomOption =
    document.getElementById("formaCustomOption");

let quantidadePersonalizada = null;

const listaAngulos =
    document.getElementById("listaAngulos");

const aviso =
    document.getElementById("aviso");

const criar =
    document.getElementById("criar");

const cancelar =
    document.getElementById("cancelar");

const limpar =
    document.getElementById("limpar");

const status =
    document.getElementById("status");


const inspetor =
    document.getElementById("inspetor");

const fechar =
    document.getElementById("fechar");

const tituloVertice =
    document.getElementById("tituloVertice");

const inputInterno =
    document.getElementById("inputInterno");

const inputExterno =
    document.getElementById("inputExterno");

const avisoVertice =
    document.getElementById("avisoVertice");

const preview =
    document.getElementById("preview");

const previewCtx =
    preview.getContext("2d");

function ajustarCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    ajustarCanvas
);

const camera = {

    x: 0,

    y: 0,

    zoom: 1

};

const teclas = {};


window.addEventListener(
    "keydown",
    event => {

        teclas[
            event.key.toLowerCase()
        ] = true;


        if (
            [
                "w",
                "a",
                "s",
                "d",
                "q",
                "e"
            ].includes(
                event.key.toLowerCase()
            )
        ) {

            event.preventDefault();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        teclas[
            event.key.toLowerCase()
        ] = false;

    }
);

let poligono = null;

let verticeSelecionado = -1;

let pontoCriacao = {

    x: 0,

    y: 0

};

const TAMANHO_LADO = 100;

function mundoTela(x, y) {

    return {

        x:
            (x - camera.x)
            * camera.zoom
            + canvas.width / 2,

        y:
            (y - camera.y)
            * camera.zoom
            + canvas.height / 2

    };

}

function telaMundo(x, y) {

    return {

        x:
            (x - canvas.width / 2)
            / camera.zoom
            + camera.x,

        y:
            (y - canvas.height / 2)
            / camera.zoom
            + camera.y

    };

}

function atualizarCamera() {

    const velocidade =
        6 / camera.zoom;


    if (teclas.w)
        camera.y -= velocidade;


    if (teclas.s)
        camera.y += velocidade;


    if (teclas.a)
        camera.x -= velocidade;


    if (teclas.d)
        camera.x += velocidade;


    if (teclas.e)
        camera.zoom *= 1.02;


    if (teclas.q)
        camera.zoom /= 1.02;


    camera.zoom =
        Math.max(
            0.05,
            Math.min(
                50,
                camera.zoom
            )
        );

}

function desenharMalha() {

    const grade = 25;


    const esquerda =
        camera.x -
        canvas.width /
        (2 * camera.zoom);


    const direita =
        camera.x +
        canvas.width /
        (2 * camera.zoom);


    const cima =
        camera.y -
        canvas.height /
        (2 * camera.zoom);


    const baixo =
        camera.y +
        canvas.height /
        (2 * camera.zoom);


    const primeiroX =
        Math.floor(
            esquerda / grade
        ) * grade;


    const primeiroY =
        Math.floor(
            cima / grade
        ) * grade;


    ctx.beginPath();

    ctx.strokeStyle =
        "#252525";

    ctx.lineWidth = 1;


    for (
        let x = primeiroX;
        x <= direita;
        x += grade
    ) {

        const p =
            mundoTela(x, 0);


        ctx.moveTo(
            p.x,
            0
        );


        ctx.lineTo(
            p.x,
            canvas.height
        );

    }


    for (
        let y = primeiroY;
        y <= baixo;
        y += grade
    ) {

        const p =
            mundoTela(0, y);


        ctx.moveTo(
            0,
            p.y
        );


        ctx.lineTo(
            canvas.width,
            p.y
        );

    }


    ctx.stroke();

    const origem =
        mundoTela(0, 0);


    ctx.beginPath();

    ctx.strokeStyle =
        "#555";

    ctx.lineWidth = 2;


    ctx.moveTo(
        origem.x,
        0
    );

    ctx.lineTo(
        origem.x,
        canvas.height
    );


    ctx.moveTo(
        0,
        origem.y
    );

    ctx.lineTo(
        canvas.width,
        origem.y
    );


    ctx.stroke();

}

function nomeVertice(numero) {

    let resultado = "";

    let n = numero + 1;


    while (n > 0) {

        n--;

        resultado =
            String.fromCharCode(
                65 + (n % 26)
            )
            + resultado;


        n =
            Math.floor(
                n / 26
            );

    }


    return resultado;

}

function obterQuantidadeVertices() {

    if (forma.value === "custom") {

        return Number(quantidadePersonalizada) || 3;

    }

    return Number(forma.value);

}

function gerarCampos() {

    const n =
        obterQuantidadeVertices();


    listaAngulos.innerHTML = "";


    const padraoInterno =
        ((n - 2) * 180) / n;


    const padraoExterno =
        180 - padraoInterno;


    for (
        let i = 0;
        i < n;
        i++
    ) {

        const grupo =
            document.createElement(
                "div"
            );


        grupo.className =
            "verticeEditor";


        const titulo =
            document.createElement(
                "div"
            );


        titulo.className =
            "verticeTitulo";


        titulo.textContent =
            "Vértice " +
            nomeVertice(i);


        grupo.appendChild(
            titulo
        );

        const labelInterno =
            document.createElement(
                "label"
            );


        labelInterno.textContent =
            "Ângulo interno:";


        grupo.appendChild(
            labelInterno
        );


        const interno =
            document.createElement(
                "input"
            );


        interno.type =
            "number";

        interno.step =
            "0.1";

        interno.value =
            padraoInterno.toFixed(2);


        interno.dataset.tipo =
            "interno";


        interno.dataset.vertice =
            i;


        grupo.appendChild(
            interno
        );

        const labelExterno =
            document.createElement(
                "label"
            );


        labelExterno.textContent =
            "Ângulo externo:";


        grupo.appendChild(
            labelExterno
        );


        const externo =
            document.createElement(
                "input"
            );


        externo.type =
            "number";

        externo.step =
            "0.1";

        externo.value =
            padraoExterno.toFixed(2);


        externo.dataset.tipo =
            "externo";


        externo.dataset.vertice =
            i;


        grupo.appendChild(
            externo
        );


        interno.addEventListener(
            "input",
            verificarSoma
        );


        externo.addEventListener(
            "input",
            verificarSoma
        );


        listaAngulos.appendChild(
            grupo
        );

    }


    verificarSoma();

}

function verificarSoma() {

    const internos =
        listaAngulos.querySelectorAll(
            'input[data-tipo="interno"]'
        );


    const externos =
        listaAngulos.querySelectorAll(
            'input[data-tipo="externo"]'
        );


    let somaInternos = 0;

    let correto = true;


    for (
        let i = 0;
        i < internos.length;
        i++
    ) {

        const interno =
            Number(
                internos[i].value
            ) || 0;


        const externo =
            Number(
                externos[i].value
            ) || 0;


        somaInternos +=
            interno;

        if (
            Math.abs(
                interno +
                externo -
                180
            ) > 0.001
        ) {

            correto = false;

        }

    }


    const esperado =
        (internos.length - 2)
        * 180;


    if (
        Math.abs(
            somaInternos -
            esperado
        ) > 0.001
        ||
        !correto
    ) {

        aviso.style.display =
            "block";


        aviso.textContent =
            "⚠ Os cálculos dos ângulos estão errados.";

    }
    else {

        aviso.style.display =
            "none";

    }

}

forma.addEventListener(
    "change",
    () => {

        if (forma.value !== "custom") {

            quantidadePersonalizada = null;

            painelVertices.style.display = "none";

        }

        gerarCampos();

    }
);

abrirVertices.addEventListener(
    "click",
    () => {

        painelVertices.style.display =
            painelVertices.style.display === "block"
                ? "none"
                : "block";

        quantidadeVertices.focus();

    }
);

confirmarVertices.addEventListener(
    "click",
    () => {

        const valor =
            Number(quantidadeVertices.value);

        if (
            !Number.isFinite(valor) ||
            !Number.isInteger(valor) ||
            valor < 1
        ) {

            quantidadeVertices.focus();
            return;

        }

        quantidadePersonalizada = valor;

        forma.value = "custom";
        formaCustomOption.textContent =
            "Polígono personalizado (" + valor + " vértices)";

        painelVertices.style.display = "none";

        gerarCampos();

    }
);

cancelarVertices.addEventListener(
    "click",
    () => {

        painelVertices.style.display = "none";

    }
);

quantidadeVertices.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            confirmarVertices.click();

        }

    }
);

canvas.addEventListener(
    "mousedown",
    event => {

        if (
            event.button !== 0
        )
            return;


        if (
            encontrarVertice(
                event.clientX,
                event.clientY
            ) !== -1
        ) {

            return;

        }


        const mundo =
            telaMundo(
                event.clientX,
                event.clientY
            );


        pontoCriacao.x =
            mundo.x;


        pontoCriacao.y =
            mundo.y;


        gerarCampos();


        criacao.style.display =
            "block";

    }
);

criar.addEventListener(
    "click",
    () => {

        const internos =
            listaAngulos.querySelectorAll(
                'input[data-tipo="interno"]'
            );


        const externos =
            listaAngulos.querySelectorAll(
                'input[data-tipo="externo"]'
            );


        const angulosInternos = [];

        const angulosExternos = [];


        for (
            let i = 0;
            i < internos.length;
            i++
        ) {

            angulosInternos.push(
                Number(
                    internos[i].value
                ) || 0
            );


            angulosExternos.push(
                Number(
                    externos[i].value
                ) || 0
            );

        }

        poligono = {

            x:
                pontoCriacao.x,

            y:
                pontoCriacao.y,

            angulos:
                angulosInternos,

            externos:
                angulosExternos

        };


        criacao.style.display =
            "none";


        fecharInspetor();


        atualizarStatus();

    }
);

cancelar.addEventListener(
    "click",
    () => {

        criacao.style.display =
            "none";

    }
);

function calcularVertices() {

    if (!poligono)
        return [];


    const vertices = [];


    let x =
        poligono.x;


    let y =
        poligono.y;

    let direcao = 0;


    for (
        let i = 0;
        i < poligono.angulos.length;
        i++
    ) {

        vertices.push({

            x: x,

            y: y

        });

        const externo =
            poligono.externos[i];


        direcao +=
            externo *
            Math.PI /
            180;


        x +=
            Math.cos(direcao)
            * TAMANHO_LADO;


        y +=
            Math.sin(direcao)
            * TAMANHO_LADO;

    }


    return vertices;

}

function encontrarVertice(
    mouseX,
    mouseY
) {

    if (!poligono)
        return -1;


    const vertices =
        calcularVertices();


    for (
        let i = 0;
        i < vertices.length;
        i++
    ) {

        const p =
            mundoTela(
                vertices[i].x,
                vertices[i].y
            );


        const dx =
            mouseX - p.x;


        const dy =
            mouseY - p.y;


        const distancia =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distancia <= 14
        ) {

            return i;

        }

    }


    return -1;

}

canvas.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();


        const indice =
            encontrarVertice(
                event.clientX,
                event.clientY
            );


        if (
            indice === -1
        ) {

            fecharInspetor();

            return;

        }


        abrirInspetor(
            indice,
            event.clientX,
            event.clientY
        );

    }
);

function abrirInspetor(
    indice,
    mouseX,
    mouseY
) {

    verticeSelecionado =
        indice;


    inputInterno.value =
        poligono.angulos[indice];


    inputExterno.value =
        poligono.externos[indice];


    tituloVertice.textContent =
        "Vértice " +
        nomeVertice(indice);


    atualizarAvisoVertice();


    let x =
        mouseX + 15;


    let y =
        mouseY + 15;


    const largura = 320;

    const altura = 430;


    if (
        x + largura >
        window.innerWidth
    ) {

        x =
            mouseX -
            largura -
            15;

    }


    if (
        y + altura >
        window.innerHeight
    ) {

        y =
            mouseY -
            altura -
            15;

    }


    inspetor.style.left =
        x + "px";


    inspetor.style.top =
        y + "px";


    inspetor.style.display =
        "block";


    desenharPreview();

}

function atualizarAvisoVertice() {

    const interno =
        Number(
            inputInterno.value
        );


    const externo =
        Number(
            inputExterno.value
        );


    if (
        !Number.isFinite(interno)
        ||
        !Number.isFinite(externo)
    ) {

        avisoVertice.style.display =
            "none";

        return;

    }


    if (
        Math.abs(
            interno +
            externo -
            180
        ) > 0.001
    ) {

        avisoVertice.style.display =
            "block";

    }
    else {

        avisoVertice.style.display =
            "none";

    }

}

function fecharInspetor() {

    inspetor.style.display =
        "none";


    verticeSelecionado =
        -1;

}


fechar.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        fecharInspetor();

    }
);

inputInterno.addEventListener(
    "input",
    () => {

        if (
            verticeSelecionado < 0
        )
            return;


        const valor =
            Number(
                inputInterno.value
            );


        if (
            !Number.isFinite(valor)
        )
            return;

        poligono.angulos[
            verticeSelecionado
        ] =
            valor;


        atualizarAvisoVertice();

        desenharPreview();

        atualizarStatus();

    }
);

inputExterno.addEventListener(
    "input",
    () => {

        if (
            verticeSelecionado < 0
        )
            return;


        const valor =
            Number(
                inputExterno.value
            );


        if (
            !Number.isFinite(valor)
        )
            return;

        poligono.externos[
            verticeSelecionado
        ] =
            valor;


        atualizarAvisoVertice();

        desenharPreview();

        atualizarStatus();

    }
);

function desenharPreview() {

    const w =
        preview.width;


    const h =
        preview.height;


    previewCtx.clearRect(
        0,
        0,
        w,
        h
    );


    if (
        verticeSelecionado < 0
    )
        return;


    const interno =
        Number(
            poligono.angulos[
                verticeSelecionado
            ]
        ) || 0;


    const externo =
        Number(
            poligono.externos[
                verticeSelecionado
            ]
        ) || 0;


    const radInterno =
        interno *
        Math.PI /
        180;


    const cx = 150;

    const cy = 80;

    const tamanho = 55;


    const inicio =
        -Math.PI / 2;


    const fim =
        inicio +
        radInterno;


    const x1 =
        cx +
        Math.cos(inicio)
        * tamanho;


    const y1 =
        cy +
        Math.sin(inicio)
        * tamanho;


    const x2 =
        cx +
        Math.cos(fim)
        * tamanho;


    const y2 =
        cy +
        Math.sin(fim)
        * tamanho;

    previewCtx.beginPath();


    previewCtx.moveTo(
        cx,
        cy
    );


    previewCtx.lineTo(
        x1,
        y1
    );


    previewCtx.moveTo(
        cx,
        cy
    );


    previewCtx.lineTo(
        x2,
        y2
    );


    previewCtx.strokeStyle =
        "white";


    previewCtx.lineWidth =
        3;


    previewCtx.stroke();

    previewCtx.beginPath();


    previewCtx.arc(
        cx,
        cy,
        30,
        inicio,
        fim,
        interno < 0
    );


    previewCtx.strokeStyle =
        "#6495ff";


    previewCtx.lineWidth =
        4;


    previewCtx.stroke();

    previewCtx.beginPath();


    previewCtx.arc(
        cx,
        cy,
        5,
        0,
        Math.PI * 2
    );


    previewCtx.fillStyle =
        "white";


    previewCtx.fill();

    previewCtx.fillStyle =
        "white";


    previewCtx.font =
        "13px Arial";


    previewCtx.textAlign =
        "center";


    previewCtx.fillText(
        "Interno: " +
        interno.toFixed(2) +
        "°",
        cx,
        125
    );


    previewCtx.fillText(
        "Externo: " +
        externo.toFixed(2) +
        "°",
        cx,
        143
    );

}

document.addEventListener(
    "mousedown",
    event => {

        if (
            inspetor.style.display !==
            "block"
        )
            return;


        if (
            inspetor.contains(
                event.target
            )
        )
            return;


        fecharInspetor();

    }
);

canvas.addEventListener(
    "wheel",
    event => {

        event.preventDefault();


        if (
            event.deltaY < 0
        ) {

            camera.zoom *= 1.1;

        }
        else {

            camera.zoom /= 1.1;

        }


        camera.zoom =
            Math.max(
                0.05,
                Math.min(
                    50,
                    camera.zoom
                )
            );

    },
    {
        passive: false
    }
);

limpar.addEventListener(
    "click",
    () => {

        poligono = null;

        verticeSelecionado =
            -1;


        fecharInspetor();


        status.textContent =
            "Nenhum polígono";


        status.style.color =
            "white";

    }
);

function obterFechamento() {

    if (!poligono)
        return null;


    const vertices =
        calcularVertices();


    if (
        vertices.length === 0
    )
        return null;

    let direcao = 0;


    for (
        let i = 0;
        i < poligono.externos.length;
        i++
    ) {

        direcao +=
            poligono.externos[i]
            * Math.PI /
            180;

    }


    const ultimo =
        vertices[
            vertices.length - 1
        ];


    const primeiro =
        vertices[0];


    const proximoX =
        ultimo.x +
        Math.cos(direcao)
        * TAMANHO_LADO;


    const proximoY =
        ultimo.y +
        Math.sin(direcao)
        * TAMANHO_LADO;


    const dx =
        proximoX -
        primeiro.x;


    const dy =
        proximoY -
        primeiro.y;


    const distancia =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    return {

        distancia: distancia,

        primeiro: primeiro,

        ultimo: ultimo,

        proximo: {

            x: proximoX,

            y: proximoY

        }

    };

}

function atualizarStatus() {

    if (!poligono) {

        status.textContent =
            "Nenhum polígono";


        status.style.color =
            "white";


        return;

    }


    const fechamento =
        obterFechamento();


    if (!fechamento)
        return;

    if (
        fechamento.distancia < 0.01
    ) {

        status.textContent =
            "✓ Polígono fechado";


        status.style.color =
            "#78ff78";

    }
    else {

        status.textContent =
            "Figura aberta — erro de fechamento: "
            +
            fechamento.distancia.toFixed(2);


        status.style.color =
            "#ff7777";

    }

}

function desenharPoligono() {

    if (!poligono)
        return;


    const vertices =
        calcularVertices();


    if (
        vertices.length === 0
    )
        return;


    const pontos =
        vertices.map(
            v =>
                mundoTela(
                    v.x,
                    v.y
                )
        );

    ctx.beginPath();


    ctx.moveTo(
        pontos[0].x,
        pontos[0].y
    );


    for (
        let i = 1;
        i < pontos.length;
        i++
    ) {

        ctx.lineTo(
            pontos[i].x,
            pontos[i].y
        );

    }


    ctx.strokeStyle =
        "white";


    ctx.lineWidth =
        2.5;


    ctx.stroke();

    const fechamento =
        obterFechamento();


    if (!fechamento)
        return;


    const primeiro =
        mundoTela(
            fechamento.primeiro.x,
            fechamento.primeiro.y
        );


    const ultimo =
        mundoTela(
            fechamento.ultimo.x,
            fechamento.ultimo.y
        );


    const proximo =
        mundoTela(
            fechamento.proximo.x,
            fechamento.proximo.y
        );

    if (
        fechamento.distancia < 0.01
    ) {

        ctx.beginPath();


        ctx.moveTo(
            ultimo.x,
            ultimo.y
        );


        ctx.lineTo(
            primeiro.x,
            primeiro.y
        );


        ctx.strokeStyle =
            "white";


        ctx.lineWidth =
            2.5;


        ctx.stroke();

    }
    else {

        ctx.beginPath();


        ctx.setLineDash([
            8,
            8
        ]);


        ctx.moveTo(
            ultimo.x,
            ultimo.y
        );


        ctx.lineTo(
            primeiro.x,
            primeiro.y
        );


        ctx.strokeStyle =
            "#ff6666";


        ctx.lineWidth =
            1.5;


        ctx.stroke();


        ctx.setLineDash([]);

        ctx.beginPath();


        ctx.arc(
            proximo.x,
            proximo.y,
            4,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ff6666";


        ctx.fill();

    }

    pontos.forEach(
        (p, i) => {

            ctx.beginPath();


            ctx.arc(
                p.x,
                p.y,

                i === verticeSelecionado
                    ? 9
                    : 6,

                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                i === verticeSelecionado
                    ? "#ffd45c"
                    : "white";


            ctx.fill();


            ctx.fillStyle =
                "white";


            ctx.font =
                "bold 14px Arial";


            ctx.fillText(
                nomeVertice(i),
                p.x + 10,
                p.y - 10
            );

        }
    );

}

function desenhar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    desenharMalha();

    desenharPoligono();

}


function loop() {

    atualizarCamera();

    desenhar();

    requestAnimationFrame(
        loop
    );

}

ajustarCanvas();

gerarCampos();

loop();
