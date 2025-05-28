import React from "react";

const ProductEdit = ({ editProduct, setEditProduct, handleUpdateProduct }) => {
  return (
    <>
      {editProduct && (
        <div className="card p-4 mb-4">
          <h3>Edit Product</h3>
          <form onSubmit={handleUpdateProduct} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, stock: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success me-2">
                Update
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ProductEdit;
