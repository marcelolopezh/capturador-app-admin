<template>
  <v-container>
    <v-card class="pa-6">
      <h3 class="mb-6">Ingresar un Usuario de App</h3>
      <v-alert type="error" v-if="valid != null && !valid"
        >Ha ocurrido un error con el envío de Información</v-alert
      >
      <v-alert type="success" v-if="registered"
        >Se ha ingresado a
        <strong>{{ usernameIngresado }} </strong>
        satisfactoriamente</v-alert
      >
      <v-form ref="form">
        <v-text-field
          v-model="username"
          label="Username"
          required
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          required
          prepend-icon="mdi-lock"
          type="password"
        ></v-text-field>
        <v-btn color="success" class="mr-4" @click="validate">
          Ingresar Nuevo Usuario
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
      endpoint: "/appuser/admin/register",
      username: null,
      password: null,
      valid: null,
      errors: null,
      registered: false,
      userRegistered: null,
      usernameIngresado: null,
      tokendb:null
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
        this.username != "" &&
        this.username != null &&
        this.password != "" &&
        this.password != null
      ) {
        this.valid = true;
        this.sendUser();
      } else {
        this.valid = false;
      }
    },

    async sendUser() {
      let formData = new FormData();
      formData.append("username", this.username);
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
        console.log("los errores estan vacios")
        this.valid = true;
        this.usernameIngresado = this.username;
        this.username = null;
        this.password = null;
        this.registered = true;
      } else {
        this.valid = false;
      }
    },
  },
};
</script>