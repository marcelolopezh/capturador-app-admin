<template>
  <v-app
    ><v-app-bar app dark>
      <v-toolbar-title>Capturador - Administración</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <Admin
        v-if="isLoggedIntoApp"
        @isLoggedIntoApp="isLoggedIntoApp = $event"
        :token="token"
      />
      <Login
        v-if="!isLoggedIntoApp"
        @isLoggedIntoApp="isLoggedIntoApp = $event"
        @token="token = $event"
      />
    </v-main>
  </v-app>
</template>

<script>
import Admin from "./components/Admin";
import Login from "./components/Login";

export default {
  name: "App",

  components: {
    Admin,
    Login,
  },

  mounted() {
    //Obtengo el token almacenado en localStorage
    let tokendb = localStorage.getItem("token");
    //Si el token no es nulo, verificar si es valido en /confirmToken
    console.log(tokendb);
    if (tokendb != null) {
      this.confirmToken(tokendb);
    }
  },

  data() {
    return {
      endpoint: "/confirmToken",
      isLoggedIntoApp: false,
      token: null,
    };
  },
  methods: {
    async confirmToken(tokendb) {
      const axios = require("axios");
      let res = await axios({
        url: this.endpoint,
        method: "get",
        headers: {
          Authorization: tokendb,
        },
      });
      // Si status=200 y data=true, retorna true, sino false
      if (res.status == 200 && res.data == true) {
        this.isLoggedIntoApp = true;
        this.token = tokendb;
      }
    },
  },
};
</script>
