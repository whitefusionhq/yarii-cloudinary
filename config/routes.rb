YariiCloudinary::Engine.routes.draw do
  resources :media do
    member do
      get 'form_thumbnail'
      get 'multiple_form_item'
    end
  end
end
