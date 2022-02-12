<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app dark>
      <v-card class="mx-auto" max-width="300" tile>
        <v-list dense>
          <v-subheader>Herramientas</v-subheader>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              @click="clicked(item.flag)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar app dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Capturador - Administración</v-toolbar-title>
    </v-app-bar>
    <v-main class="pa-6">
      <Mediciones v-if="medFlag" />
      <v-row v-if="tomFlag">
        <v-col md="4">
          <Tomadores />
        </v-col>
        <v-col md="8">
          <TomadoresTable />
        </v-col>
      </v-row>
      <v-row v-if="usappFlag">
        <v-col md="4">
          <UsuariosApp />
        </v-col>
        <v-col md="8">
          <UsuariosAppTable />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import Mediciones from "./Mediciones";
import Tomadores from "./Tomadores";
import TomadoresTable from "./TomadoresTable";
import UsuariosApp from "./UsuariosApp";
import UsuariosAppTable from "./UsuariosAppTable";
export default {
  name: "Admin",
  props: ["token"],
  components: {
    Mediciones,
    Tomadores,
    TomadoresTable,
    UsuariosApp,
    UsuariosAppTable,
  },

  data() {
    return {
      endpoint: "/confirmToken",
      drawer: false,
      items: [
        { text: "Mediciones", icon: "mdi-flash", flag: "med" },
        { text: "Tomadores de Estado", icon: "mdi-account", flag: "tom" },
        { text: "Usuarios App", icon: "mdi-account-cog", flag: "usapp" },
        { text: "Salir", icon: "mdi-location-exit", flag: "exit" },
      ],
      medFlag: false,
      tomFlag: false,
      usappFlag: false,
      selectedItem: null,
    };
  },

  mounted() {
    this.medFlag = true;
    //console.log("token desde admin => " + this.token)
    localStorage.setItem("token", this.token);
  },

  methods: {
    clicked(event) {
      this.allFalse();
      if (event == "med") this.medFlag = true;
      if (event == "tom") this.tomFlag = true;
      if (event == "usapp") this.usappFlag = true;
      if (event == "exit") {
        localStorage.setItem("token", null);
        this.token = null;
        this.$emit("isLoggedIntoApp", false);
      }
      this.drawer = false;
    },
    allFalse() {
      this.medFlag = false;
      this.tomFlag = false;
      this.usappFlag = false;
    },
  },
};
</script>
