export interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  discount: string;
  category: string;
  inStock: boolean;
  unit: string;
}

export const mockProducts: { [key: string]: Product[] } = {
  dairy: [
    {
      id: "dairy_1",
      name: "Amul Milk 500ml",
      image: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 30,
      discountedPrice: 25,
      description: "Fresh full cream milk from Amul dairy. Rich in calcium and protein, perfect for daily consumption.",
      discount: "17% OFF",
      category: "dairy",
      inStock: true,
      unit: "500ml"
    },
    {
      id: "dairy_2",
      name: "Mother Dairy Paneer 200g",
      image: "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 80,
      discountedPrice: 65,
      description: "Soft and fresh paneer made from pure milk. Perfect for curries and snacks.",
      discount: "19% OFF",
      category: "dairy",
      inStock: true,
      unit: "200g"
    },
    {
      id: "dairy_3",
      name: "Amul Butter 100g",
      image: "https://images.pexels.com/photos/479643/pexels-photo-479643.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 50,
      discountedPrice: 42,
      description: "Creamy butter made from fresh cream. Great for cooking and spreading.",
      discount: "16% OFF",
      category: "dairy",
      inStock: true,
      unit: "100g"
    },
    {
      id: "dairy_4",
      name: "Nestle Yogurt 400g",
      image: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 60,
      discountedPrice: 48,
      description: "Thick and creamy yogurt with live cultures. Healthy and delicious.",
      discount: "20% OFF",
      category: "dairy",
      inStock: true,
      unit: "400g"
    },
    {
      id: "dairy_5",
      name: "Amul Cheese Slices 200g",
      image: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 120,
      discountedPrice: 95,
      description: "Premium cheese slices perfect for sandwiches and burgers.",
      discount: "21% OFF",
      category: "dairy",
      inStock: true,
      unit: "200g"
    }
  ],
  'fruits-vegetables': [
    {
      id: "fruits_1",
      name: "Fresh Red Apples 1kg",
      image: "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 120,
      discountedPrice: 95,
      description: "Crisp and sweet red apples. Rich in fiber and vitamins.",
      discount: "21% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "1kg"
    },
    {
      id: "fruits_2",
      name: "Fresh Bananas 1kg",
      image: "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 40,
      discountedPrice: 32,
      description: "Ripe yellow bananas. Great source of potassium and energy.",
      discount: "20% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "1kg"
    },
    {
      id: "fruits_3",
      name: "Fresh Tomatoes 500g",
      image: "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 25,
      discountedPrice: 20,
      description: "Fresh red tomatoes. Essential for cooking and salads.",
      discount: "20% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "500g"
    },
    {
      id: "fruits_4",
      name: "Fresh Onions 1kg",
      image: "https://images.pexels.com/photos/144248/onions-food-vegetables-healthy-144248.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 30,
      discountedPrice: 24,
      description: "Fresh white onions. Base ingredient for most Indian dishes.",
      discount: "20% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "1kg"
    },
    {
      id: "fruits_5",
      name: "Fresh Carrots 500g",
      image: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 35,
      discountedPrice: 28,
      description: "Fresh orange carrots. Rich in beta-carotene and vitamins.",
      discount: "20% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "500g"
    },
    {
      id: "fruits_6",
      name: "Fresh Spinach 250g",
      image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 20,
      discountedPrice: 16,
      description: "Fresh green spinach leaves. Packed with iron and nutrients.",
      discount: "20% OFF",
      category: "fruits-vegetables",
      inStock: true,
      unit: "250g"
    }
  ],
  groceries: [
    {
      id: "grocery_1",
      name: "Basmati Rice 5kg",
      image: "https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 400,
      discountedPrice: 320,
      description: "Premium basmati rice with long grains and aromatic fragrance.",
      discount: "20% OFF",
      category: "groceries",
      inStock: true,
      unit: "5kg"
    },
    {
      id: "grocery_2",
      name: "Toor Dal 1kg",
      image: "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 120,
      discountedPrice: 95,
      description: "High quality toor dal. Rich in protein and essential nutrients.",
      discount: "21% OFF",
      category: "groceries",
      inStock: true,
      unit: "1kg"
    },
    {
      id: "grocery_3",
      name: "Sunflower Oil 1L",
      image: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 150,
      discountedPrice: 125,
      description: "Pure sunflower cooking oil. Light and healthy for daily cooking.",
      discount: "17% OFF",
      category: "groceries",
      inStock: true,
      unit: "1L"
    },
    {
      id: "grocery_4",
      name: "Mixed Spices Pack",
      image: "https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 200,
      discountedPrice: 160,
      description: "Essential spices pack with turmeric, chili, coriander and more.",
      discount: "20% OFF",
      category: "groceries",
      inStock: true,
      unit: "pack"
    },
    {
      id: "grocery_5",
      name: "Wheat Flour 5kg",
      image: "https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 180,
      discountedPrice: 144,
      description: "Fresh wheat flour perfect for making rotis and bread.",
      discount: "20% OFF",
      category: "groceries",
      inStock: true,
      unit: "5kg"
    },
    {
      id: "grocery_6",
      name: "Sugar 1kg",
      image: "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      originalPrice: 45,
      discountedPrice: 38,
      description: "Pure white sugar for cooking and beverages.",
      discount: "16% OFF",
      category: "groceries",
      inStock: true,
      unit: "1kg"
    }
  ]
};