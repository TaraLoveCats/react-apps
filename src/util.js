export const generateID = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

export const id2TypeAndIconName = (categories) => {
    return categories.reduce((map, item) => {
      map[item.id] = {
          type: item.type,
          iconName: item.iconName,
          name: item.name
      };
      return map;
    }, {})
}
