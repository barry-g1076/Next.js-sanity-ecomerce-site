import React, {useState}from "react";
import {urlFor, client} from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext} from "../../context/StateContext";

const ProductDetails = ({products,product}) => {
    const {image,name,details,price}=product;
    const {decQty,incQty,qty}=useStateContext;
    const [index, setIndex]=useState(0);
   console.log(qty);
  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img src={urlFor(image&&image[index])} className="product-detail-image" />
          </div>
          {/* <div className="small-images-container">
            {image?.map((item,i)=>(<img 
            src={urlFor(item)}
            className={i===index?'small-image selected-image':'small-image'}
            onMouseEnter={() => setIndex(i)}
            />))}
          </div> */}
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews"> 
            <div>
                <AiFillStar/>
                <AiFillStar/>
                <AiFillStar/>
                <AiFillStar/>
                <AiFillStar/>
                <AiOutlineStar/>
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
                <span className="minus" ><AiOutlineMinus/></span>
                <span className="num"></span>
                <span className="plus"><AiOutlinePlus/></span>
            </p>
          </div>
          <div className="buttons">
            <button type="button" className="add-to-cart" >Add to Cart</button>
            <button type="button" className="buy-now" >Buy Now</button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also Like </h2>
        <div className="marquee">
            <div className="maylike-products-container track">
                {products.map((item)=>(<Product key={item._id} product={item}/>))}
            </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async ({params:{slug}}) =>{
    const query = `*[_type == "product" && slug.current== '${slug}'][0]`;

    const productsQuery='*[_type == "product"]';
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);
    
    const bannerQuery = '*[_type == "banner"]';
    const bannerData = await client.fetch(bannerQuery);
     
    return {
      props: {products,product}
    }
  }

  export const getStaticPaths = async () => {
    const query=`*[_type == "product"]{
        slug{
            current
        }
    }`;
    const products = await client.fetch(query);
    const paths =products.map((product)=>({
        params:{
            slug: product.slug.current
        }
    }));
    return {
        // paths: [], //indicates that no page needs be created at build time
        paths,
        fallback: 'blocking' //indicates the type of fallback
    }
}
export default ProductDetails;
