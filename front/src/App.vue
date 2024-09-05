<template>
  <nav>
    <router-link to="/map"> Map </router-link>
    <router-link to="/register"> Register </router-link>
    <router-link to="/upload-image"> Image Upload </router-link> <!-- New Link -->
  </nav>
  <router-view/>
</template>

<style>
@import "~bulma/css/bulma.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 15px; /* Adds space between links */
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
