module YariiCloudinary
  module ApplicationHelper
    include ::Webpacker::Helper

    def current_webpacker_instance
      YariiCloudinary.webpacker
    end
  end
end
