<template>
  <div>
    <v-container fluid>
      <v-card class="pa-6">
        <v-card-title>Buscador de Mediciones</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-container fluid>
                <v-card class="pa-6">
                  <v-card-title>Filtros de Búsqueda</v-card-title>
                  <v-col
                    ><v-select
                      :items="itemsSearch"
                      label="Buscar Por"
                      @change="changeSearch()"
                      v-model="selectedOption"
                    ></v-select>

                    <div v-if="isNumeroServicio">
                      <v-text-field
                        v-model="numeroServicio"
                        label="Numero de Servicio"
                        type="number"
                        @change="filterNumeroServicio()"
                      ></v-text-field>
                    </div>
                    <div v-if="isTomador">
                      <v-select
                        :items="tomadoresList"
                        :item-text="(item) => item.nombre + ' ' + item.apellido"
                        item-value="id"
                        label="Tomador De Estados"
                        v-model="tomador"
                      >
                      </v-select>
                    </div>
                    <div v-if="isFecha" class="text-center">
                      <v-date-picker
                        v-model="rangoFechas"
                        range
                        full-width
                        locale="es"
                      ></v-date-picker>
                    </div>
                    <div v-if="isYearAndMonth">
                      <v-select
                        :items="years"
                        :item-text="(item) => item.nombre"
                        item-value="id"
                        label="Años"
                        v-model="year"
                      >
                      </v-select>
                    </div>

                    <div v-if="isYearAndMonth">
                      <v-select
                        :items="months"
                        :item-text="(item) => item.nombre"
                        item-value="id"
                        label="Meses"
                        v-model="month"
                      >
                      </v-select>
                    </div>
                    <!-- FILTRO DE EXITOSO / ERROR -->

                    <div
                      v-if="
                        isTomador ||
                        isNumeroServicio ||
                        isFecha ||
                        isYearAndMonth
                      "
                    >
                      <v-select
                        :items="successError"
                        :item-text="(item) => item.nombre"
                        item-value="id"
                        label="Exitoso / Error"
                        v-model="successErrorFilter"
                      >
                      </v-select>
                    </div>

                    <v-btn
                      @click="searchInDB()"
                      color="primary"
                      class="mt-4"
                      v-if="
                        isFecha ||
                        isTomador ||
                        isNumeroServicio ||
                        (year != null && month != null)
                      "
                      :disabled="
                        tomador == null &&
                        (numeroServicio == null || numeroServicio == '') &&
                        year == null &&
                        month == null &&
                        rangoFechas == null
                      "
                    >
                      <v-icon dark left> mdi-file-find </v-icon> Buscar
                    </v-btn>
                    <v-btn
                      @click="_generateCSV()"
                      color="primary"
                      class="mt-4 float-right"
                      v-if="
                        (isFecha ||
                          isTomador ||
                          isNumeroServicio ||
                          (year != null && month != null)) &&
                        mediciones.length > 0 &&
                        showExportButton
                      "
                    >
                      <v-icon dark left> mdi-microsoft-excel </v-icon> Exportar
                    </v-btn></v-col
                  >
                </v-card>
              </v-container>
            </v-col>

            <v-col cols="8" v-cloak>
              <v-container fluid>
                <v-card class="pa-6">
                  <v-card-title>Resultado de Búsqueda</v-card-title>

                  <v-data-table
                    v-if="!dataCargada"
                    class="elevation-1"
                    loading
                    loading-text="Cargando Información"
                  ></v-data-table>
                  <v-data-table v-cloak
                    v-if="dataCargada"
                    :headers="headers"
                    :items="mediciones"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    :search="search"
                    pageCount="10"
                    hide-default-footer
                    class="elevation-1"
                    divider="true"
                    @page-count="pageCount = $event"
                  >
                    <template v-slot:item.medidor="{ item }">
                      {{ formatMedidor(item) }}
                    </template>
                    <template v-slot:item.medidor123="{ item }">
                      {{ getLastChar(item) }}
                    </template>
                    <template v-slot:item.fecha="{ item }">
                      {{ item.fecha | moment("DD-MM-YYYY - HH:mm") }}
                    </template>
                    <template v-slot:item.motivo="{ item }">
                      <v-chip
                        :color="'green'"
                        style="width: 100%"
                        dark
                        v-if="item.motivo == 'null'"
                      >
                        Sin Motivo Reportado
                      </v-chip>
                      <v-chip
                        :color="'red'"
                        style="width: 100%"
                        dark
                        v-if="item.motivo !== 'null'"
                      >
                        {{ item.motivo }}
                      </v-chip>
                    </template>
                  </v-data-table>
                  <div class="text-center pt-2">
                    <v-pagination
                      v-model="page"
                      :length="pageCount"
                    ></v-pagination>
                  </div>
                </v-card>
              </v-container>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Mediciones",

  data() {
    return {
      showExportButton: false,
      mediciones: null,
      endpoint: "/mediciones/getAll",
      headers: [
        { text: "ID", align: "start", value: "id" },
        { text: "SERVICIO", value: "nroServicio", align: "center" },
        { text: "DV", value: "dv", align: "center" },
        { text: "MEDIDOR", value: "medidor", align: "center" },
        { text: "MEDIDOR123", value: "medidor123", align: "center" },
        { text: "LECTURA", value: "lectura", align: "center" },
        { text: "FECHA", value: "fecha", align: "center" },
        { text: "MOTIVO", value: "motivo", align: "center" },
      ],
      dataCargada: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: null,
      selectedItem: 1,
      tokendb: null,
      itemsSearch: [
        "Número de Servicio",
        "Rango de Fechas",
        "Tomador de Estados",
        "Año y Mes",
      ],
      selectedOption: null,
      numeroServicio: null,
      isNumeroServicio: false,
      isFecha: false,
      isTomador: false,
      isYearAndMonth: false,
      fechaDesde: null,
      fechaHasta: null,
      rangoFechas: null,
      tomadoresList: null,
      tomador: null,
      month: null,
      year: null,
      isYear: false,
      months: [
        { id: "01", nombre: "Enero" },
        { id: "02", nombre: "Febrero" },
        { id: "03", nombre: "Marzo" },
        { id: "04", nombre: "Abril" },
        { id: "05", nombre: "Mayo" },
        { id: "06", nombre: "Junio" },
        { id: "07", nombre: "Julio" },
        { id: "08", nombre: "Agosto" },
        { id: "09", nombre: "Septiembre" },
        { id: "10", nombre: "Octubre" },
        { id: "11", nombre: "Noviembre" },
        { id: "12", nombre: "Diciembre" },
      ],
      years: [
        { id: "2021", nombre: "2021" },
        { id: "2022", nombre: "2022" },
      ],
      successError: [
        { id: "null", nombre: "Todas" },
        { id: "false", nombre: "Sin Errores" },
        { id: "true", nombre: "Con Errores" },
      ],
      headersCSV: {
        nroServicio: "servicio",
        medidor: "medidor",
        medidor123: "medidor123",
        lectura: "lectura",
        fecha: "fecha_lectura",
        tomador: "tomador",
        //hora: "hora_lectura",
      },
      itemsFormatted: [],
      successErrorFilter: null,
    };
  },

  mounted() {
    this.tokendb = localStorage.getItem("token");
    this.getMedicionesFromApi();
    this.getTomadoresFromApi();
  },

  methods: {
    formatMedidor(medidor) {
      let aux = medidor.medidor.toString();
      aux = aux.slice(0, -1);
      return aux;
    },
    getLastChar(medidor) {
      let aux = medidor.medidor.toString();
      return aux.charAt(aux.length - 1);
    },

    async _generateCSV(){
      await this.generateCSV()
    },
    async generateCSV() {
      this.itemsFormatted = [];
      this.mediciones.forEach((item) => {
          this.itemsFormatted.push({
          nroServicio: item.nroServicio,
          medidor: this.formatMedidor(item),
          medidor123: this.getLastChar(item),
          lectura: item.lectura,
          fecha: item.fecha.split("T")[0],
          tomador: item.tomador.letra
          //hora: item.fecha.split("T")[1].split(".")[0],
        });
      });
      var fileTitle = "Mediciones";
      this.exportCSVFile(this.itemsFormatted, fileTitle);
    },

    convertToCSV() {
      let objArray = this.itemsFormatted;
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (line != "") line += ",";
          line += array[i][index];
        }
        str += line + "\r\n";
      }
      return str;
    },

    exportCSVFile(items, fileTitle) {
      if (this.headersCSV) {
        items.unshift(this.headersCSV);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);
      var csv = this.convertToCSV(jsonObject);
      var exportedFilenmae = fileTitle + ".csv" || "export.csv";
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },

    filterNumeroServicio() {
      if (this.numeroServicio <= 0) {
        this.numeroServicio = 1;
      } else if (this.numeroServicio >= 99999) {
        this.numeroServicio = 99999;
      }
    },
    async getTomadoresFromApi() {
      await axios
        .get("/tomador/getAll", {
          headers: {
            Authorization: this.tokendb,
          },
        })
        .then((response) => (this.tomadoresList = response.data));
    },
    async getMedicionesFromApi() {
      try {
        let res = await axios({
          url: this.endpoint,
          method: "get",
          headers: {
            Authorization: this.tokendb,
          },
        });
        this.mediciones = res.data;

        this.dataCargada = true;
        
      } catch (err) {
        console.log(false);
      }
    },
    changeSearch() {
      this.showExportButton = false;
      this.isNumeroServicio = false;
      this.isFecha = false;
      this.isTomador = false;
      this.isYearAndMonth = false;

      this.tomador = null;
      this.numeroServicio = null;
      this.year = null;
      this.month = null;
      this.rangoFechas = null;

      if (this.selectedOption == "Número de Servicio")
        this.isNumeroServicio = true;
      if (this.selectedOption == "Rango de Fechas") this.isFecha = true;
      if (this.selectedOption == "Tomador de Estados") this.isTomador = true;
      if (this.selectedOption == "Año y Mes") this.isYearAndMonth = true;
    },

    searchInDB() {
      if (this.isNumeroServicio) {
        let formData = new FormData();
        formData.append("numeroServicio", this.numeroServicio);
        formData.append("successErrorFilter", this.successErrorFilter);
        axios
          .post("/medicion/getByNumeroServicio", formData, {
            headers: {
              Authorization: this.tokendb,
            },
          })
          .then((response) => (this.mediciones = response.data));
      } else if (this.isFecha) {
        let formData = new FormData();

        formData.append("start", this.rangoFechas[0]);
        formData.append("end", this.rangoFechas[1]);
        formData.append("successErrorFilter", this.successErrorFilter);
        axios
          .post("/medicion/findByFecha", formData, {
            headers: {
              Authorization: this.tokendb,
            },
          })
          .then((response) => (this.mediciones = response.data));
      } else if (this.isTomador) {
        let formData = new FormData();
        formData.append("tomadorId", this.tomador);
        formData.append("successErrorFilter", this.successErrorFilter);
        axios
          .post("/medicion/findByTomador", formData, {
            headers: {
              Authorization: this.tokendb,
            },
          })
          .then((response) => (this.mediciones = response.data));
      } else if (this.isYearAndMonth) {
        let formData = new FormData();
        formData.append("year", this.year);
        formData.append("month", this.month);
        formData.append("successErrorFilter", this.successErrorFilter);
        axios
          .post("/medicion/findByYearAndMonth", formData, {
            headers: {
              Authorization: this.tokendb,
            },
          })
          .then((response) => (this.mediciones = response.data));
      }
      this.showExportButton = true;
      console.log(this.mediciones)
    },

  
  },
};
</script>