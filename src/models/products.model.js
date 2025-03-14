import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5 },
    description: { type: String, required: true, minlength: 20 },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true }
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);

export default productsModel;