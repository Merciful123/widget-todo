import { useState } from "react";
import {
  Button,
  Drawer,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { widgetData } from "../../utils/jsonData.js";
import BackspaceIcon from "@mui/icons-material/Backspace";
import SearchIcon from "@mui/icons-material/Search"; 

const Dashboard = () => {
  const [categories, setCategories] = useState(widgetData);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newWidget, setNewWidget] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  // adding widget category
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newId = categories.length + 1;
      setCategories([
        ...categories,
        { id: newId, category: newCategory, widgets: [] },
      ]);
      setNewCategory("");
      setOpen(false);
    }
  };


  // adding widget

  const handleAddWidget = () => {
    if (newWidget.trim()) {
      const updatedCategories = categories.map((cat) => {
        if (cat.id === currentCategory) {
          return {
            ...cat,
            widgets: [
              ...cat.widgets,
              { id: cat.widgets.length + 1, name: newWidget },
            ],
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
      setNewWidget("");
      setOpen(false);
    }
  };

  const handleOpenConfirm = (categoryId, widgetId) => {
    setCurrentCategory(categoryId);
    setWidgetToDelete(widgetId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setWidgetToDelete(null);
  };

  // deleting widget

  const handleDeleteWidget = () => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === currentCategory) {
        return {
          ...cat,
          widgets: cat.widgets.filter((widget) => widget.id !== widgetToDelete),
        };
      }
      return cat;
    });
    setCategories(updatedCategories);
    handleCloseConfirm();
  };

  const handleOpenDrawer = (categoryId = null, isCategory = true) => {
    setAddingCategory(isCategory);
    setCurrentCategory(categoryId);
    setOpen(true);
  };


  // searching widget
   const filteredCategories = categories.map((category) => ({
     ...category,
     widgets: category.widgets.filter((widget) =>
       widget.name.toLowerCase().includes(searchTerm.toLowerCase())
     ),
   }));


  return (
    <div className="p-6 bg-indigo-50 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold max-sm:text-[1rem] m-0">
          Widget Dashboard
        </h1>
        <Button
          className="flex justify-center !normal-case max-sm:px-0"
          variant="contained"
          onClick={() => handleOpenDrawer(null, true)}
        >
          Add Widget Category
        </Button>
      </div>
      {/* Search Input */}
      <div className="mb-4 flex items-center">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search Widgets..."
          InputProps={{
            startAdornment: <SearchIcon className="mr-2" />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="h-full w-full">
        {filteredCategories.map((category) => (
          <div key={category.id} className="p-2 w-full h-full">
            <h2 className="text-xl font-semibold">{category.category}</h2>
            <div className="">
              <div className="mt-1 h-full overflow-x-auto flex max-[768px]:flex max-[768px]:flex-col gap-2 justify-start items-center">
                {category.widgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="lg:min-w-[450px] max-sm:w-full h-[250px]"
                  >
                    <div className="rounded-lg w-full bg-white p-2 h-full flex justify-between items-center">
                      {widget.name}
                      <IconButton
                        aria-label="delete"
                        className="place-self-start"
                        onClick={() =>
                          handleOpenConfirm(category.id, widget.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
                <div className="lg:min-w-[450px] max-sm:w-full h-[250px]">
                  <div className="rounded-lg bg-white h-full flex justify-center items-center">
                    <Button
                      variant="outlined"
                      className="!normal-case"
                      onClick={() => handleOpenDrawer(category.id, false)}
                    >
                      Add Widget
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="p-4 w-80">
          {addingCategory ? (
            <div className="flex flex-col gap-4 ">
              <div className="flex  gap-4 justify-between">
                <h3 className="text-lg font-semibold mb-4">
                  Add Widget Category
                </h3>
                <BackspaceIcon
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                />
              </div>
              <TextField
                label="Category Name"
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                className="mt-4 !normal-case"
                onClick={handleAddCategory}
              >
                Add Widget Category
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 flex-col">
              <div className="flex  gap-4 justify-between">
                <h3 className="text-lg font-semibold ">Add New Widget</h3>
                <BackspaceIcon
                  onClick={() => setOpen(false)}
                  className="cursor-pointer"
                />
              </div>
              <TextField
                label="Widget Name"
                fullWidth
                value={newWidget}
                onChange={(e) => setNewWidget(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddWidget}
                className="!normal-case"
              >
                Add Widget
              </Button>
            </div>
          )}
        </div>
      </Drawer>

      {/* Model for deletion */}

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this widget?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} className="!normal-case">
            Cancel
          </Button>
          <Button
            className="!normal-case"
            color="error"
            onClick={handleDeleteWidget}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
 