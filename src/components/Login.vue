<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="4">
        <v-card class="pa-6">
          <v-card-title>Inicio de Sesión</v-card-title>
          <v-alert type="error" v-if="errorLogin"
            >Ha ocurrido un Error </v-alert
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
              
              type="password"
              prepend-icon="mdi-lock"
               autocomplete="on"
            ></v-text-field>
            <v-btn color="success" class="mr-4" @click="pre_login()">
              Ingresar
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  components: {},

  data() {
    return {
      endpoint: "/appuser/admin/login",
      username: null,
      password: null,
      token: null,
      errors: null,
      errorLogin: false,
    };
  },

  mounted() {},

  methods: {
    pre_login() {
      this.login();
    },
    async login() {
      this.errors = null;
      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("password", this.password);

      var f = new Date();
      let dd = f.getDay();
      dd = ("0" + dd).slice(-2);
      let mm = String(f.getMonth() + 1).padStart(2, "0");
      mm = ("0" + mm).slice(-2);
      var yyyy = f.getFullYear();
      var fecha = String(dd) + "/" + String(mm) + "/" + yyyy;
      formData.append("fecha", fecha);

      const axios = require("axios");
      // eslint-disable-next-line no-unused-vars
      const responsex = await axios
        .post(this.endpoint, formData)
        .then((response) => (this.token = response.data))
        .catch((error) => {
          this.errors = error;
        });
      if (this.errors == null && this.token != null) {
        this.$emit("isLoggedIntoApp", true);
        this.$emit("token", this.token);
      } else {
        this.errorLogin = true;
      }
    },
  },
};
</script>
