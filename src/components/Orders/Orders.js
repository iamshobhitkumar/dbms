import React, { useState, useEffect } from 'react';
import '../../BootstrapCSS/bootstrap.min.css';
import './Orders.css'; 
import NavBar from '../NavBar/NavBar'

const Orders = () => {
    const [userType, setUserType] = useState('');
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("/getusertype").then(res => res.json()).then(data => {
            setUserType(data['type']);
        });

        fetch("/getorders").then(res => res.json()).then(data => {
            setOrders(data);
        });
    }, [])

    return (
        <div className="order-main-bg">
            <NavBar userType={userType}/>
            <div className = "table-responsive center order-bg" style={{width: 1000, }}>
                <h1>Orders:</h1>
                <div><a id="orders-btn" className="btn btn-primary btn-rounded" href="/main">Back to shopping</a></div>

                <table className="table table-striped table-bordered" width = "100">
                    <thead className= "table-dark">
                    <tr>
                            <th scope="col">Order #</th>
                            <th scope="col">Customer ID</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Category</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Date</th>
                    </tr>
                    </thead>
                    <tbody>

                    {orders.map((order) => (
                        <tr>
                            <th scope="row">{order.order_id}</th>
                            <th scope="row">{order.customer_id}</th>
                            <th scope="row">{order.productName}</th>
                            <th scope="row">{order.category}</th>
                            <th scope="row">{order.quantity}</th>
                            <th scope="row">$ {(order.price).toFixed(2)} CAD</th>
                            <th scope="row">{(order.date).substring(0, order.date.length - 13)}</th>
                        </tr>
                    ))}
                    </tbody> 
                </table>
            </div>
        </div>
    );
}

export default Orders;

