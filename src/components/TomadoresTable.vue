<template>
  <v-container>
    <v-card class="pa-6">
      <h3 class="mb-6">Listado de Tomadores de Estados</h3>
      <v-btn
        class="mx-2"
        fab
        dark
        large
        color="cyan"
        @click="getTomadoresFromApi()"
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
        hide-default-footer
        class="elevation-1"
        divider="true"
        @page-count="pageCount = $event"
        @click:row="editUser"
      >
        <template v-slot:item.authorized="{ item }">
          <v-chip
            :color="'green'"
            style="width: 100%"
            dark
            v-if="item.authorized"
            @click="changeAuthorized(item)"
          >
            Habilitado
          </v-chip>
          <v-chip
            :color="'red'"
            style="width: 100%"
            dark
            v-if="!item.authorized"
            @click="changeAuthorized(item)"
          >
            No Habilitado
          </v-chip>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>

    <!-- START EDIT USER -->
    <v-row justify="center" v-if="dialog">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Modificar Usuario</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" v-if="success">
                  <v-alert type="success">Usuario Modificado!</v-alert>
                </v-col>
                <v-col cols="12" v-if="errors">
                  <v-alert type="error">Ha ocurrido un error</v-alert>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Primer Nombre"
                    required
                    :value="dataToEdit.nombre"
                    v-model="newNombre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Primer Apellido"
                    required
                    :value="dataToEdit.apellido"
                    v-model="newApellido"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Letra"
                    required
                    :value="dataToEdit.letra"
                    v-model="newLetra"
                    maxlength="1"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Nueva Password"
                    required
                    v-model="newPassword"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Cerrar
            </v-btn>
            <v-btn color="blue darken-1" text @click="_editUser()">
              Guardar Cambios
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- START EDIT USER -->
  </v-container>
</template>
<script>
export default {
  name: "Tomadores",
  data() {
    return {
      endpoint: "/tomador/getAll",
      headers: [
        { text: "ID", align: "start", value: "id" },
        { text: "NOMBRE", value: "nombre" },
        { text: "APELLIDO", value: "apellido" },
        { text: "LETRA", value: "letra" },
        { text: "HABILITADO", value: "authorized" },
      ],
      dataCargada: false,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: null,
      tomadores: null,
      tokendb: null,
      letra: null,
      dialog: false,
      dataToEdit: null,
      newNombre: null,
      newApellido: null,
      newPassword: null,
      newLetra: null,
      idToEdit: null,
      success: false,
      errors: false,
    };
  },

  mounted() {
    this.tokendb = localStorage.getItem("token");
    this.getTomadoresFromApi();
  },

  methods: {
    editUser(item) {
      this.dataToEdit = item;
      this.idToEdit = item.id;
      this.newNombre = item.nombre;
      this.newApellido = item.apellido;
      this.newLetra = item.letra;
      this.success = false;
      this.errors = false;
      this.dialog = true;
    },
    _editUser() {
      if (
        this.newNombre == null ||
        this.newApellido == null 
      ) {
        this.success = false;
        this.errors = true;
        return;
      }
      const token = localStorage.getItem("token");
      var formData = new FormData();
      formData.append("id", this.idToEdit);
      formData.append("newNombre", this.newNombre);
      formData.append("newApellido", this.newApellido);
      formData.append("newPassword", this.newPassword);
      formData.append("newLetra", this.newLetra);
      const axios = require("axios");
      axios
        .put("editTomador", formData, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.status == 200) {
            this.success = true;
            this.errors = false;
            this.newPassword = null;
          }
        })
        .catch(() => {
          this.success = false;
          this.errors = true;
        });
    },
    getTomadoresFromApi() {
      this.dataCargada = false;
      this._getTomadoresFromApi();
    },
    async _getTomadoresFromApi() {
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
        //console.table(this.tomadores);
        return true;
      } catch (err) {
        console.log(false);
        return false;
      }
    },
    async changeAuthorized(tomador) {
      let formData = new FormData();
      formData.append("tomador_id", tomador.id);
      const axios = require("axios");
      // eslint-disable-next-line no-unused-vars
      const responsex = await axios
        .put("/update/authorized/tomador", formData, {
          headers: {
            Authorization: this.tokendb,
          },
        })
        .then((response) => (this.tomadores = response.data))
        .catch((error) => {
          this.errors = error;
        });
    },
  },
};
</script>