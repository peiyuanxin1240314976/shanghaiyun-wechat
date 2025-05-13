Component({
  externalClasses: ['title-class', 'icon-class', 'number-class'],
  options: {
    multipleSlots: true,
  },
  properties: {
    groundStatistics: {
      type: Array,
      value: [],
    },

    classPrefix: {
      type: String,
      value: 'wr',
    },
  },
  methods: {

  },
});
