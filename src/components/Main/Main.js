import React, { useState, useEffect } from 'react';
import '../../BootstrapCSS/bootstrap.min.css';
import './Main.css';
import NavBar from '../NavBar/NavBar'

const Main = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [userType, setUserType] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch("/getallproducts").then(res => res.json()).then(data => {
            setProducts(data);
        });

        fetch("/getcart").then(res => res.json()).then(data => {
            setCart(data);
        });

        fetch("/getusertype").then(res => res.json()).then(data => {
            setUserType(data['type']);
        });
    }, [])

    const handleCart = (e) => {
        console.log(cart)
        const id = e.target.id
        if(cart.includes(id)){
            setCart(cart.filter(item => item !== id));
            fetch("/removefromcart", {
                method:"POST",
                cache: "no-cache",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({productID: id})
            })
        } else{
            setCart([...cart, id]);
            fetch("/addtocart", {
                method:"POST",
                cache: "no-cache",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({productID: id})
            })
        }
    }

    const handleFilter = (e) => {
        fetch("/alterfilter", {
            method:"POST",
            cache: "no-cache",
            headers:{
                "Content-type":"application/json",
            },
            body:JSON.stringify({categoryID: category})
        }).then(res => res.json()).then(data => {
            setProducts(data);
        })
    }


    const handleDelete = (e) => {
        const id = e.target.value;
        fetch("/deleteproduct", {
            method:"POST",
            cache: "no-cache",
            headers:{
                "Content-type":"application/json",
            },
            body:JSON.stringify({id:id})
        }).then(res => res.json()).then(data => {
            setProducts(data);
        })
    }

    const handleSearch = () => {
        fetch("/searchproduct", {
            method:"POST",
            cache: "no-cache",
            headers:{
                "Content-type":"application/json",
            },
            body:JSON.stringify({search: search})
        }).then(res => res.json()).then(data => {
            setProducts(data);
        })
    }

    return (
        <div className="order-main-bg">
            <NavBar userType={userType}/>
            <div className="main-body">
                <div className="main-header">
                    <h1>Products</h1>
                    <h5>Select a category:</h5>
                    <select onChange={(e) => setCategory(e.target.value)}>
                        <option value='all'>All</option>
                        <option value='0'>Tshirt</option>
                        <option value='1'>Pants</option>
                        <option value='2'>Jacket</option>
                        <option value='3'>Sweater</option>
                        <option value='4'>Socks</option>
                    </select>
                    <button type="button" onClick={handleFilter} className={`btn btn-outline-info`}>Apply Filter</button>
                    <br></br>
                    <input onChange={ (event) => setSearch(event.target.value) }/>
                    <button type="button" onClick={handleSearch} className={`btn btn-outline-info`}>Search Product</button>
                </div>

                <div className="products">
                    <div className="card-group card">
                        {products.map((product, id) => (
                            <div id="card-recipe" className="card shadow p-3 mb-5 bg-white rounded cards" key={product.id} style={{width: "20rem"}}>
                                {
                                    (userType === 'admin') ? (
                                        <button value={product.id} onClick={handleDelete} id="x">X</button>
                                    ) : null
                                }
                                <img className="card-img-top" src={product.picture} alt={product.productName} style={{height: "15rem"}} />
                                <div className="card-body">
                                    <hr/>
                                    <h5 className="card-title">{product.productName}</h5>
                                    <h4 className="prod-category">{product.category}</h4>
                                    <h4 className="price">$ {(product.price).toFixed(2)} CAD</h4>
                                    <h4 className="price">Amt. Available: {product.quantity}</h4>
                                    {
                                        (userType !== 'admin') ? (
                                            (cart.includes(product.id.toString())) ? (
                                                <button type="button" id={product.id} onClick={handleCart} className={`btn btn-outline-info btn-recipe inner-button selected`}>Remove from Cart</button>
                                            ) : <button type="button" id={product.id} onClick={handleCart} className={`btn btn-outline-info btn-recipe inner-button`}>Add to Cart</button>
                                        ) : null
                                    }
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;