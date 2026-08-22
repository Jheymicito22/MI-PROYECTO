// ==========================================
// VARIABLES GLOBALES
// ==========================================

let resultadosGuardados = [];


// ==========================================
// CAMBIAR ENTRE SECCIONES
// ==========================================

function mostrarSeccion(seccion) {

    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(function(elemento) {
        elemento.classList.add("oculto");
    });

    const seleccionada = document.getElementById(seccion);

    if (seleccionada) {
        seleccionada.classList.remove("oculto");
    }

    // Si abre recomendaciones
    if (seccion === "recomendacion") {
        mostrarRecomendaciones();
    }
}


// ==========================================
// BUSCAR PLANTA
// ==========================================

async function buscarPlanta() {

    const texto = document
        .getElementById("busqueda")
        .value
        .trim()
        .toLowerCase();

    const resultado =
        document.getElementById("resultadoBusqueda");

    if (texto === "") {

        resultado.innerHTML = `
            <div class="ficha-planta">

                <h3>⚠️ Escribe una planta</h3>

                <p>
                    Introduce el nombre de una planta.
                </p>

            </div>
        `;

        return;
    }

    try {

        const respuesta =
            await fetch("./datos/plantas.json");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar plantas.json");
        }

        const plantas =
            await respuesta.json();

        const planta =
            plantas.find(function(p) {

                return p.nombre
                    .toLowerCase()
                    .includes(texto);

            });


        if (!planta) {

            resultado.innerHTML = `

                <div class="ficha-planta">

                    <h3>❌ Planta no encontrada</h3>

                    <p>
                        No encontramos
                        <strong>${texto}</strong>.
                    </p>

                    <h4>🌱 Plantas disponibles:</h4>

                    <ul>

                        ${plantas.map(function(p) {

                            return `<li>${p.nombre}</li>`;

                        }).join("")}

                    </ul>

                </div>

            `;

            return;
        }


        resultado.innerHTML = `

            <div class="ficha-planta">

                <h2>🌱 ${planta.nombre}</h2>

                <p>
                    <strong>Nombre científico:</strong>
                    ${planta.nombreCientifico}
                </p>

                <hr>

                <h3>⛰️ Altitud adecuada</h3>

                <p>
                    ${planta.altitud.min}
                    -
                    ${planta.altitud.max}
                    m
                </p>

                <h3>🌡️ Temperatura adecuada</h3>

                <p>
                    ${planta.temperatura.min}
                    -
                    ${planta.temperatura.max}
                    °C
                </p>

                <h3>💧 Humedad adecuada</h3>

                <p>
                    ${planta.humedad.min}
                    -
                    ${planta.humedad.max}
                    %
                </p>

                <h3>📐 Espacio necesario</h3>

                <p>
                    ${planta.espacioPorPlanta}
                    m² por planta
                </p>

                <h3>🌱 Suelo</h3>

                <p>
                    ${planta.suelo}
                </p>

                <h3>☀️ Luz</h3>

                <p>
                    ${planta.luz}
                </p>

            </div>

        `;

    }

    catch (error) {

        console.error(error);

        resultado.innerHTML = `

            <div class="ficha-planta">

                <h3>⚠️ Error</h3>

                <p>
                    No se pudo cargar la base de datos.
                </p>

            </div>

        `;
    }
}



// ==========================================
// ANALIZAR ZONA
// ==========================================

async function analizarZona() {

    const lugar =
        document.getElementById("lugar").value.trim();

    const altitud =
        Number(document.getElementById("altitud").value);

    const temperatura =
        Number(document.getElementById("temperatura").value);

    const humedad =
        Number(document.getElementById("humedad").value);

    const area =
        Number(document.getElementById("area").value);

    const resultado =
        document.getElementById("resultadoZona");


    // ==========================================
    // VALIDAR
    // ==========================================

    if (
        lugar === "" ||
        !Number.isFinite(altitud) ||
        !Number.isFinite(temperatura) ||
        !Number.isFinite(humedad) ||
        !Number.isFinite(area) ||
        area <= 0
    ) {

        resultado.innerHTML = `

            <div class="ficha-planta">

                <h3>⚠️ Datos incompletos</h3>

                <p>
                    Completa todos los campos
                    correctamente.
                </p>

            </div>

        `;

        return;
    }


    try {

        // ==========================================
        // CARGAR JSON
        // ==========================================

        const respuesta =
            await fetch("./datos/plantas.json");

        if (!respuesta.ok) {
            throw new Error("Error cargando JSON");
        }

        const plantas =
            await respuesta.json();


        // ==========================================
        // ANALIZAR
        // ==========================================

        const resultados =
            plantas.map(function(planta) {

                let puntos = 0;


                // ALTITUD

                const altitudCorrecta =
                    altitud >= planta.altitud.min &&
                    altitud <= planta.altitud.max;

                if (altitudCorrecta) {
                    puntos++;
                }


                // TEMPERATURA

                const temperaturaCorrecta =
                    temperatura >= planta.temperatura.min &&
                    temperatura <= planta.temperatura.max;

                if (temperaturaCorrecta) {
                    puntos++;
                }


                // HUMEDAD

                const humedadCorrecta =
                    humedad >= planta.humedad.min &&
                    humedad <= planta.humedad.max;

                if (humedadCorrecta) {
                    puntos++;
                }


                // ESPACIO

                const cantidad =
                    Math.floor(
                        area / planta.espacioPorPlanta
                    );

                const espacioCorrecto =
                    cantidad >= 1;

                if (espacioCorrecto) {
                    puntos++;
                }


                // COMPATIBILIDAD

                const compatibilidad =
                    Math.round(
                        (puntos / 4) * 100
                    );


                // NIVEL

                let nivel;
                let icono;

                if (compatibilidad >= 75) {

                    nivel = "RECOMENDADA";
                    icono = "🟢";

                }

                else if (compatibilidad >= 50) {

                    nivel = "POSIBLE";
                    icono = "🟡";

                }

                else {

                    nivel = "NO RECOMENDADA";
                    icono = "🔴";

                }


                return {

                    planta: planta,

                    compatibilidad: compatibilidad,

                    nivel: nivel,

                    icono: icono,

                    cantidad: cantidad,

                    altitudCorrecta: altitudCorrecta,

                    temperaturaCorrecta: temperaturaCorrecta,

                    humedadCorrecta: humedadCorrecta,

                    espacioCorrecto: espacioCorrecto

                };

            });


        // ==========================================
        // ORDENAR
        // ==========================================

        resultados.sort(function(a, b) {

            return b.compatibilidad -
                   a.compatibilidad;

        });


        // ==========================================
        // ⭐ GUARDAR RESULTADOS
        // ==========================================

        resultadosGuardados = resultados;


        // ==========================================
        // MOSTRAR ANÁLISIS
        // ==========================================

        let html = `

            <div class="ficha-planta">

                <h2>🧠 Análisis de tu zona</h2>

                <p>
                    📍 <strong>Lugar:</strong>
                    ${lugar}
                </p>

                <p>
                    ⛰️ <strong>Altitud:</strong>
                    ${altitud} m
                </p>

                <p>
                    🌡️ <strong>Temperatura:</strong>
                    ${temperatura} °C
                </p>

                <p>
                    💧 <strong>Humedad:</strong>
                    ${humedad} %
                </p>

                <p>
                    📐 <strong>Área:</strong>
                    ${area} m²
                </p>

                <hr>

                <h2>🌱 Resultados</h2>

        `;


        resultados.forEach(function(r) {

            const planta = r.planta;

            html += `

                <div class="resultado-planta">

                    <h3>
                        ${r.icono}
                        ${planta.nombre}
                    </h3>

                    <p>
                        <strong>
                            Compatibilidad:
                        </strong>

                        ${r.compatibilidad}%
                    </p>

                    <p>
                        <strong>
                            ${r.nivel}
                        </strong>
                    </p>

                    <p>
                        📐 Puedes plantar aproximadamente:

                        <strong>
                            ${r.cantidad}
                        </strong>

                        plantas.
                    </p>

                    <p>
                        ⛰️ Altitud:
                        ${r.altitudCorrecta
                            ? "🟢 Adecuada"
                            : "🔴 No adecuada"}
                    </p>

                    <p>
                        🌡️ Temperatura:
                        ${r.temperaturaCorrecta
                            ? "🟢 Adecuada"
                            : "🔴 No adecuada"}
                    </p>

                    <p>
                        💧 Humedad:
                        ${r.humedadCorrecta
                            ? "🟢 Adecuada"
                            : "🔴 No adecuada"}
                    </p>

                    <p>
                        📐 Espacio:
                        ${r.espacioCorrecto
                            ? "🟢 Suficiente"
                            : "🔴 Insuficiente"}
                    </p>

                </div>

            `;

        });


        html += `

            </div>

        `;


        resultado.innerHTML = html;


        // ==========================================
        // ⭐ MENSAJE PARA IR A RECOMENDACIONES
        // ==========================================

        resultado.innerHTML += `

            <div class="ficha-planta">

                <h3>🌱 ¿Quieres ver las mejores opciones?</h3>

                <p>
                    El sistema ya analizó tu zona.
                </p>

                <button
                    onclick="mostrarSeccion('recomendacion')"
                >
                    🧠 VER RECOMENDACIONES
                </button>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "ERROR:",
            error
        );

        resultado.innerHTML = `

            <div class="ficha-planta">

                <h3>⚠️ Error</h3>

                <p>
                    No se pudo analizar la zona.
                </p>

            </div>

        `;
    }
}



// ==========================================
// MOSTRAR RECOMENDACIONES
// ==========================================

function mostrarRecomendaciones() {

    const resultado =
        document.getElementById(
            "resultadoRecomendacion"
        );


    // ==========================================
    // NO HAY DATOS
    // ==========================================

    if (
        !resultadosGuardados ||
        resultadosGuardados.length === 0
    ) {

        resultado.innerHTML = `

            <div class="ficha-planta">

                <h3>
                    🌱 Todavía no hay recomendaciones
                </h3>

                <p>
                    Primero analiza tu zona para
                    conocer las plantas adecuadas.
                </p>

                <button
                    onclick="mostrarSeccion('zona')"
                >
                    🗺️ ANALIZAR MI ZONA
                </button>

            </div>

        `;

        return;
    }


    // ==========================================
    // OBTENER LAS MEJORES
    // ==========================================

    const mejores =
        resultadosGuardados.filter(function(r) {

            return r.compatibilidad >= 75;

        });


    // ==========================================
    // MOSTRAR
    // ==========================================

    let html = `

        <div class="ficha-planta">

            <h2>🌱 Mejores plantas para tu zona</h2>

            <p>
                El sistema encontró
                <strong>${mejores.length}</strong>
                plantas con una compatibilidad
                igual o superior al 75%.
            </p>

    `;


    if (mejores.length === 0) {

        html += `

            <div class="resultado-planta">

                <h3>⚠️ Ninguna planta es ideal</h3>

                <p>
                    Ninguna planta alcanzó
                    el 75% de compatibilidad.
                </p>

                <p>
                    Puedes modificar las condiciones
                    de tu zona e intentar nuevamente.
                </p>

            </div>

        `;

    }

    else {

        mejores.forEach(function(r) {

            const planta = r.planta;

            html += `

                <div class="resultado-planta">

                    <h3>
                        ${r.icono}
                        ${planta.nombre}
                    </h3>

                    <h4>
                        Compatibilidad:
                        ${r.compatibilidad}%
                    </h4>

                    <p>
                        <strong>
                            ${r.nivel}
                        </strong>
                    </p>

                    <p>
                        📐 Puedes plantar aproximadamente:

                        <strong>
                            ${r.cantidad}
                        </strong>

                        plantas.
                    </p>

                    <hr>

                    <h4>
                        📋 Condiciones
                    </h4>

                    <ul>

                        <li>
                            ⛰️ Altitud:
                            ${
                                r.altitudCorrecta
                                ? "🟢 Adecuada"
                                : "🔴 No adecuada"
                            }
                        </li>

                        <li>
                            🌡️ Temperatura:
                            ${
                                r.temperaturaCorrecta
                                ? "🟢 Adecuada"
                                : "🔴 No adecuada"
                            }
                        </li>

                        <li>
                            💧 Humedad:
                            ${
                                r.humedadCorrecta
                                ? "🟢 Adecuada"
                                : "🔴 No adecuada"
                            }
                        </li>

                        <li>
                            📐 Espacio:
                            ${
                                r.espacioCorrecto
                                ? "🟢 Suficiente"
                                : "🔴 Insuficiente"
                            }
                        </li>

                    </ul>

                </div>

            `;

        });

    }


    html += `

        </div>

    `;


    resultado.innerHTML = html;
}