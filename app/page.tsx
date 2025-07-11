"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import desserts from "../public/desserts.json"

interface DessertImage {
  thumbnail: string
  mobile: string
  tablet: string
  desktop: string
}

interface DessertItem {
  name: string
  category: string
  price: number
  image: DessertImage
}

interface CartItem extends DessertItem {
  quantity: number
  id: string
}

export default function DessertOrderingApp() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  const addToCart = (dessert: DessertItem) => {
    const dessertWithId = { ...dessert, id: generateId(dessert.name) }
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dessertWithId.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === dessertWithId.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...dessertWithId, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const confirmOrder = () => {
    setShowConfirmation(true)
  }

  const startNewOrder = () => {
    setCart([])
    setShowConfirmation(false)
  }

  const isInCart = (dessertId: string) => {
    return cart.some((item) => item.id === dessertId)
  }

  const getItemQuantity = (dessertId: string) => {
    const item = cart.find((item) => item.id === dessertId)
    return item ? item.quantity : 0
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Desserts Grid */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-rose-900 mb-8 animate-fade-in">Desserts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {desserts.map((dessert, index) => {
                const dessertId = generateId(dessert.name)
                return (
                  <Card 
                    key={dessertId} 
                    className="overflow-hidden border-0 shadow-sm group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="relative">
                      <Image
                        src={dessert.image.desktop || "/placeholder.svg"}
                        alt={dessert.name}
                        width={240}
                        height={240}
                        className="w-full h-60 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        {!isInCart(dessertId) ? (
                          <Button
                            onClick={() => addToCart(dessert)}
                            className="bg-white text-rose-900 border-2 border-red-500 hover:bg-red-500 hover:text-white rounded-full px-6 py-2 font-semibold shadow-lg transition-all duration-300 hover:scale-105 animate-bounce-in"
                          >
                            <Image src="/assets/images/icon-add-to-cart.svg" alt="Add to Cart" width={20} height={20} />
                            <span className="ml-2">Add to Cart</span>
                          </Button>
                        ) : (
                          <div className="bg-red-500 text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg animate-slide-in">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 rounded-full border border-white hover:bg-white hover:text-red-500 transition-all duration-200 hover:scale-110"
                              onClick={() => updateQuantity(dessertId, -1)}
                            >
                              <Image src="/assets/images/icon-decrement-quantity.svg" alt="Decrease" width={12} height={12} />
                            </Button>
                            <span className="font-semibold min-w-[20px] text-center animate-pulse-number">{getItemQuantity(dessertId)}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 rounded-full border border-white hover:bg-white hover:text-red-500 transition-all duration-200 hover:scale-110"
                              onClick={() => updateQuantity(dessertId, 1)}
                            >
                              <Image src="/assets/images/icon-increment-quantity.svg" alt="Increase" width={12} height={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardContent className="pt-8 pb-4">
                      <p className="text-sm text-rose-400 mb-1 transition-colors duration-200 group-hover:text-rose-500">{dessert.category}</p>
                      <h3 className="font-semibold text-rose-900 mb-2 transition-colors duration-200 group-hover:text-red-600">{dessert.name}</h3>
                      <p className="text-red-500 font-semibold transition-all duration-200 group-hover:text-red-600 group-hover:scale-105">${dessert.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8 shadow-lg animate-fade-in-right">
              <h2 className="text-2xl font-bold text-red-500 mb-6 transition-all duration-300">
                Your Cart ({getTotalItems()})
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-32 h-32 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center animate-float">
                    <Image src="/assets/images/illustration-empty-cart.svg" alt="Empty Cart" width={64} height={64} />
                  </div>
                  <p className="text-rose-400">Your added items will appear here</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between py-2 animate-slide-in-left hover:bg-rose-50 rounded-lg px-2 transition-all duration-200"
                        style={{
                          animationDelay: `${index * 100}ms`
                        }}
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-rose-900">{item.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-red-500 font-semibold animate-pulse-gentle">{item.quantity}x</span>
                            <span className="text-rose-400">@ ${item.price.toFixed(2)}</span>
                            <span className="font-semibold text-rose-500">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 rounded-full border border-rose-300 hover:bg-rose-100 transition-all duration-200 hover:scale-110 hover:rotate-90"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Image src="/assets/images/icon-remove-item.svg" alt="Remove" width={14} height={14} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between py-4 mb-6 animate-slide-in-up">
                    <span className="text-rose-900 font-semibold">Order Total</span>
                    <span className="text-2xl font-bold text-rose-900 animate-pulse-total">${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-6 text-sm text-rose-600 animate-fade-in">
                    <Image src="/assets/images/icon-carbon-neutral.svg" alt="Carbon Neutral" width={18} height={18} className="animate-spin-slow" />
                    <span>
                      This is a <strong>carbon-neutral</strong> delivery
                    </span>
                  </div>

                  <Button
                    onClick={confirmOrder}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-in"
                  >
                    Confirm Order
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md animate-zoom-in">
          <DialogTitle className="sr-only">Order Confirmation</DialogTitle>

          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-6 animate-bounce-in">
              <Image src="/assets/images/icon-order-confirmed.svg" alt="Order Confirmed" width={48} height={48} />
            </div>

            <h2 className="text-3xl font-bold text-rose-900 mb-2 animate-fade-in">Order Confirmed</h2>
            <p className="text-rose-400 mb-8 animate-fade-in-delay">We hope you enjoy your food!</p>

            <div className="space-y-4 mb-8">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center gap-4 p-3 bg-rose-50 rounded-lg animate-slide-in-left hover:bg-rose-100 transition-all duration-200"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Image
                    src={item.image.thumbnail || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded transition-transform duration-200 hover:scale-110"
                  />
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-rose-900">{item.name}</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-red-500 font-semibold">{item.quantity}x</span>
                      <span className="text-rose-400">@ ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-rose-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-between mb-8 animate-slide-in-up">
              <span className="text-rose-900 font-semibold">Order Total</span>
              <span className="text-2xl font-bold text-rose-900">${getTotalPrice().toFixed(2)}</span>
            </div>

            <Button
              onClick={startNewOrder}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounce-in"
            >
              Start New Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  )
}