document.addEventListener("DOMContentLoaded", (e) => {
  getAtenciones();
  iniciarFechaChange()
});

function iniciarFechaChange() {
  const fpDesde = flatpickr(".fecha", {
    enableTime: false,
    dateFormat: "d-m-Y",
    time_24hr: true,
    disableMobile: true,
    onChange: function (selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        fpHasta.set("minDate", selectedDates[0]);
      }
    },
  });

}

async function getAtenciones() {
  let fecha = document.getElementById("fecha");
  let listaAtenciones = document.getElementById("accordionAtencion");
  try {
    let response = await fetch(
      "../atenciones/apiGetTodayAtenciones?fecha=" + fecha.value,
      {
        method: "GET",
      }
    );

    let data = await response.json();
    let htmlAtencion = '';
    let verifyFirst = 0;
    let expanded = "true"
    let collapsed = ""
    let show = "show"
    if (!data.error) {


      data.data.forEach((atencion) => {
        if (verifyFirst != 0 ) {
          expanded = "false"
          show = ""
          collapsed = "collapsed"
        }
        verifyFirst += 1;
        htmlAtencion += `
                        
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="heading${atencion.id}">
                                        <button class="accordion-button ${collapsed} fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${atencion.id}" aria-expanded="${expanded}" aria-controls="collapse${atencion.id}">
                                            Atención - ${atencion.fecha}
                                        </button>
                                    </h2>
                                    <div id="collapse${atencion.id}" class="accordion-collapse collapse ${show}" aria-labelledby="heading${atencion.id}" data-bs-parent="#accordionAtencion">
                                        <div class="accordion-body">
                                            <form>
                                              <div class='row'>
                                                <div class='col-md-6'>
                                                  <p><strong>Cliente:</strong> ${atencion.nombreCliente}<p>
                                                </div>
                                                <div class='col-md-6'>
                                                  <p><strong>Mascota:</strong> ${atencion.mascota}<p>
                                                </div>
                                                <div class="col-12">
                                                    <textarea class="form-control validate" placeholder="Escribe Diagnosticos" id="diagnostico" name="diagnostico" rows="3"></textarea>
                                                </div>
                                                <div class="col-12 mt-3">
                                                    <button class="btn btn-primary btnColorGeneral" type="submit"><i class="align-middle me-2 fas fa-fw fa-save"></i></button>
                                                </div>
                                              </div>
                                            </form>
                                            
                                        </div>
                                    </div>
                                </div>

            `;
      });

      listaAtenciones.innerHTML = htmlAtencion;
    } else {
      Swal.fire({
        icon: "error",
        text: data.message,
      });
    }
  } catch (error) {
    console.log(error);
  }
}