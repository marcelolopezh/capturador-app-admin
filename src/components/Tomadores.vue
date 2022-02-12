<template>
  <v-container>
    <v-card class="pa-6">
      <h3 class="mb-6">Ingresar un Nuevo Tomador de Estados</h3>
      <v-alert type="error" v-if="valid != null && !valid"
        >Los campos ingresados no cumplen son incorrectos</v-alert
      >
      <v-alert type="success" v-if="registered"
        >Se ha ingresado a
        <strong
          >{{ nombreIngresado.toUpperCase() }}
          {{ apellidoIngresado.toUpperCase() }}
        </strong>
        satisfactoriamente</v-alert
      >
      <v-form ref="form">
        <v-text-field
          v-model="nombre"
          label="Primer Nombre"
          required
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="apellido"
          label="Primer Apellido"
          required
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="letra"
          label="Letra"
          required
          prepend-icon="mdi-alpha-m-circle"
          @change="letra = letra.toUpperCase()"
          maxlength="1"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          required
          type="password"
          prepend-icon="mdi-lock"
          autocomplete="on"
        ></v-text-field>
        <v-btn color="success" class="mr-4" @click="validate">
          Ingresar Tomador
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  name: "Tomadores",
  data() {
    return {
      endpoint: "/register/tomador",
      nombre: null,
      apellido: null,
      password: null,
      valid: null,
      errors: null,
      registered: false,
      userRegistered: null,
      tokendb: null,
      letra: null,
    };
  },
  mounted() {
    this.tokendb = localStorage.getItem("token");
  },
  methods: {
    validate() {
      this.registered = false;
      this.errors = null;
      if (
        this.nombre != "" &&
        this.nombre != null &&
        this.apellido != "" &&
        this.apellido != null &&
        this.password != "" &&
        this.password != null &&
        this.letra != "" &&
        this.letra != null
      ) {
        this.valid = true;
        this.sendTomador();
      } else {
        this.valid = false;
      }
    },

    async sendTomador() {
      let formData = new FormData();
      formData.append("nombre", this.nombre);
      formData.append("apellido", this.apellido);
      formData.append("letra", this.letra);
      var f = new Date();
      var fecha = f.toISOString();
      formData.append("fecha", fecha);

      formData.append("password", this.password);

      const axios = require("axios");
      // eslint-disable-next-line no-unused-vars
      const responsex = await axios
        .post(this.endpoint, formData, {
          headers: {
            Authorization: this.tokendb,
          },
        })
        .then((response) => (this.userRegistered = response.data))
        .catch((error) => {
          this.errors = error;
        });
      if (this.errors == null) {
        this.valid = true;
        this.nombreIngresado = this.nombre;
        this.apellidoIngresado = this.apellido;
        this.nombre = null;
        this.apellido = null;
        this.password = null;
        this.letra = null;
        this.registered = true;
      } else {
        this.valid = false;
      }
    },
  },
};
</script>