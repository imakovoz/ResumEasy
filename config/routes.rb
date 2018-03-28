Rails.application.routes.draw do

  namespace :api, defaults: { format: :json } do
    resources :companies, only: [:index, :create, :show, :update]
    resources :jobs, only: [:index, :show, :create, :update]
    resources :users, only: [:index, :show, :create, :update]
    resource :session, only: [:create, :destroy]
  end


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: "static_pages#root"
end