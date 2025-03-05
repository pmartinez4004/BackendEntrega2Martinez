import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'Products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code:{
        type:String,
        unique: true, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    thumbnail:{
        type: String,
        default: null,
        required: false 
    }
    
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;