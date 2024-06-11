export const simpleList = async (schemaName, filter, populateOptions) => {
  let populateString = "",
    buildQuery,
    data;
  if (populateOptions.length > 0) {
    populateOptions.forEach((option) => {
      populateString += `populate('${option}')`;
    });
  }
  buildQuery = `${schemaName}.find(filter).${populateString}`;
  data = await buildQuery;
  console.log(data);
};

export const create = async (schemaName, data) => {
  let newData = new schemaName(data);
  newData = await newData.save();
  return newData;
};

export const isUnique = async (schemaName, uniqueField) => {
  let data = await schemaName.findOne(uniqueField);
  if (!data) return true;
  return false;
};

export const countItems = async (schemaName, filter) => {
  let count, data;
  count = await schemaName.countDocuments(filter);
  return count;
};

export const fetch = async (schemaName, filter = {}, populateOptions = []) => {
  filter = { ...filter, isDeleted: { $ne: true } }
  let populateField = populateOptions.toString();
  let data = await schemaName
    .find(filter)
    .select("-password")
    .populate(`${populateField}`)
    .sort({ createdAt: "desc" })
    .lean();
  return data;
};

export const fetchOne = async (schemaName, filter, populateOptions = []) => {
  filter = { ...filter, isDeleted: { $ne: true } } 
  let populateField = populateOptions.toString();
  let data = await schemaName.findOne(filter).populate(`${populateField}`);
  return data;
};

export const update = async (
  schemaName,
  filter,
  data,
  populateOptions = []
) => {
  let populateField = populateOptions.toString();
  let updatedData = await schemaName
    .findOneAndUpdate(filter, data, {
      new: true,
      upsert: true,
      omitUndefined: true,
    })
    .populate(`${populateField}`)
    .lean();
  return updatedData;
};

export const deleteItem = async (schemaName, filter) => {
  let item = await schemaName.findOneAndUpdate(filter, { isDeleted: true });
  return item;
};

export const hardDeleteItem = async (schemaName, filter) => {
  let item = await schemaName.deleteMany(filter);
  return item;
};

export const updateAll = async (schemaName, filter, data) => {
  let update = await schemaName.updateMany(filter, data, {
    new: true,
    upsert: true,
  });
  return update;
};

export const selectFetch = async (
  schemaName,
  filter,
  select,
  populateOptions = []
) => {
  filter = { ...filter, isDeleted: { $ne: true } }
  let populateField = populateOptions.toString();
  let data = await schemaName
    .findOne(filter)
    .select(select)
    .populate(`${populateField}`)
    .lean();
  return data;
};
