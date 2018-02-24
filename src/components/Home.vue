<template>
  <div id="app">
    <div id="status" style="height: 50px; margin-top: 15px">
      <center>
        Filters: {{tagArray}} {{categoryArray}}
        <div v-if="!isLoaded">
          Loading...
          <br>
          <pulse-loader style="display: inline-block"></pulse-loader>
        </div>
        <div v-if="errors">
          <h1 style="color: red">Error fetching datasets</h1>
        </div>
      </center>
    </div>
    <div v-if="datasets.length">
      <div v-for="dataset in datasets" :key="dataset.id" style="margin-top: 15px; padding: 5px 5px; border: 2px solid #aaa">
        <div>
          <strong>{{dataset.title}}</strong>
        </div>
        <div>{{dataset.shortDescription}}</div>
        <strong>Tags:</strong>
        <span v-if="dataset.tags" :key="dataset.id">
          <span v-for="tag in dataset.tags" :key="tag + dataset.id" class="tag" v-on:click="filterByTag(tag)">
            {{tag}}
          </span>
        </span>
      </div>
    </div>
  </div>



</template>

<script>
  import PulseLoader from "vue-spinner/src/PulseLoader.vue";
  import axios from 'axios'
  export default {
    name: 'HelloWorld',
    mounted() {
      let tags = [];
      let types = [];
      let categories = [];
      //let api = 'http://localhost:3000/datasets'
      let api = `http://mock.icjia.cloud/datasets`

      function slugify(text) {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '-')           // Replace spaces with -
          .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
          .replace(/\-\-+/g, '-')         // Replace multiple - with single -
          .replace(/^-+/, '')             // Trim - from start of text
          .replace(/-+$/, '');            // Trim - from end of text
      }

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      axios.get(api)
        .then(response => {
          // console.log(response)
          this.loading = false;
          // Get all datasets, insert in store
          this.$store.datasets = response.data

          // Set tags/categories/types to store
          this.$store.datasets.forEach(function (dataset) {
            if (dataset.tags) tags.push(...dataset.tags);
            if (dataset.type) types.push(dataset.type);
            if (dataset.category) categories.push(dataset.category);
            if (!dataset.slug) dataset.slug = slugify(dataset.title)
            if (dataset.title) dataset.title = capitalizeFirstLetter(dataset.title)
            return
          })
          // remove duplicates, set de-duped to store
          this.$store.tags = Array.from(new Set(tags))
          this.$store.types = Array.from(new Set(types))
          this.$store.categories = Array.from(new Set(categories))
          this.isLoaded = true;
          this.datasets = this.$store.datasets
          this.$forceUpdate();

        })
        .catch(e => {
          this.errors = true;
          console.log(e);
          this.$forceUpdate();

        })

    },
    components: {
      PulseLoader,

    },
    methods: {
      filterByTag: function (tag) {

        if (!this.tagArray.includes(tag)) {
          this.tagArray.push(tag)
          console.log('Tag added to array: ', this.tagArray)
        }
        this.filterDatasets();
      },
      deleteTag: function (tag) {
        this.tagArray = this.tagArray.filter(item => item !== tag)
        console.log('Filtered: ', this.tagArray)
        this.datasets = this.$store.datasets
        this.filterDatasets();

      },
      filterDatasets: function () {
        let datasets = this.datasets
        let filtered = []
        let filters = this.tagFilter;
        let vm = this;

        //console.log('Filters: ', filters)
        if (this.tagArray.length) {
          let tagArray = this.tagArray.slice(-1).pop()
          datasets.map(function (ds) {
            if (ds.tags) {
              ds.tags.map(function (t) {
                if (t === tagArray) filtered.push(ds)
              })
            }
          });
          datasets = filtered;
          //console.log(datasets.length)
        }
        this.datasets = datasets


      }
    },
    data() {
      return {
        datasets: [],
        isLoaded: false,
        errors: false,
        tagArray: [],
        categoryArray: []
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tag {
    color: blue
  }

  .tag:hover {
    cursor: pointer
  }
</style>