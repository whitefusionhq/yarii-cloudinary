module YariiCloudinary
  class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
    include YariiEditor::ControllerAuthorization
  end
end
