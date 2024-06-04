import { Image } from "../../common/ReusableComponents/Image";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";
import { DeliveryStatements } from "../Home/components/DeliveryStatements/DeliveryStatements";

export const SingleProduct = () => {
  const { productId } = useParams(); //get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://cones-and-stones-ppnudpghiq-lz.a.run.app/products/${productId}`
        );

        const data = await response.json();
        if (data.success) {
          setProduct(data.response);
          setError(null);
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        } else {
          setError(data.error.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <div className="singleproduct-page">
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
      </div>

      {product && (
        <div>
          <div className="image-container">
            <Image src={product.image_url} alt="product-image" />
          </div>
          <div className="product-info">
            <h2>{product.name}</h2>
            <h4>{product.price} SEK</h4>
            <p>{product.description}</p>
            <p>{product.details}</p>
            <div className="size-buttons">
              {product.stock.map((item, index) => (
                <button key={index}>{item.size}</button>
              ))}
            </div>
            <button className="add-to-cart-button">Add to cart</button>
            <DeliveryStatements className="spp-delivery"/>
          </div>
        </div>
      )}
    </div>
  );
};
