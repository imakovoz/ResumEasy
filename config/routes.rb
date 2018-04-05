Rails.application.routes.draw do

  get 'api/scrape/jobs', to: 'api/jobs#scrape_index', as: 'sjobs', defaults: { format: :json }
  get 'api/apply', to: 'api/applications#apply', as: 'apply', defaults: { format: :json }
  get 'api/categorize', to: 'api/carts#sort', as: 'sort', defaults: { format: :json }

  namespace :api, defaults: { format: :json } do
    resources :applications, only: [:index, :create, :destroy]
    resources :carts, only: [:index, :create, :update, :destroy]
    resources :companies, only: [:index, :create, :show, :update]
    resources :jobs, only: [:index, :show, :create, :update]
    resources :users, only: [:index, :show, :create, :update]
    resource :session, only: [:create, :destroy]
  end


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: "static_pages#root"
end
