<template>
  <v-container>
    <v-card class="pa-6">
      <h3 class="mb-6">Listado de Tomadores de Usuarios App</h3>
      <v-btn
        class="mx-2"
        fab
        dark
        large
        color="cyan"
        @click="getUsuariosFromApi()"
      >
        <v-icon dark> mdi-refresh </v-icon>
      </v-btn>

      <v-data-table
        v-if="!dataCargada"
        class="elevation-1"
        loading
        loading-text="Cargando Información"
      ></v-data-table>
      <v-data-table
        v-if="dataCargada"
        :headers="headers"
        :items="tomadores"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        :search="search"
        hide-default-footer
        class="elevation-1"
        divider="true"
        @page-count="pageCount = $event"
      >
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "Tomadores",
  data() {
    return {
      endpoint: "/appuser/getAll",
      headers: [
        { text: "username", align: "start", value: "username" },
        { text: "password", value: "password" },
      ],
      dataCargada: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: null,
      tomadores: null,
      tokendb: null,
    };
  },

  mounted() {
    this.tokendb = localStorage.getItem("token");
    this.getUsuariosFromApi();
  },

  methods: {
    getUsuariosFromApi() {
      this.dataCargada = false;
      this._getUsuariosFromApi();
    },
    async _getUsuariosFromApi() {
      const axios = require("axios");
      try {
        let res = await axios({
          url: this.endpoint,
          method: "get",
          headers: {
            Authorization: this.tokendb,
          },
        });
        this.tomadores = res.data;
        this.dataCargada = true;
        console.table(this.tomadores);
        return true;
      } catch (err) {
        console.log(false);
        return false;
      }
    },
  },
};
</script>