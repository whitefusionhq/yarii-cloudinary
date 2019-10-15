module YariiCloudinary
  class MediaController < ApplicationController
    def index
      json_images = Cloudinary::Api.resources_by_tag('yarii_editor', cloud_name: ENV['yarii_cloudinary_cloud_name'], api_key: ENV['yarii_cloudinary_api_key'], api_secret: ENV['yarii_cloudinary_api_secret'], max_results: 200)['resources']

      @images = json_images.map do |image|
        {
          path: "v#{image['version']}/#{image['public_id']}",
          id: image['public_id'],
          format: image['format']
        }
      end

      render layout: false
    end

    def form_thumbnail
      render partial: 'form_thumbnail', layout: nil, formats: [:html], locals: {public_id: params[:id]}
    end

    def multiple_form_item
      render_locals = {
        public_id: params[:id],
        name: params[:name],
        index: params[:index],
        input_classes: params[:input_classes],
        placeholder:  params[:placeholder]
      }
      render partial: 'multiple_form_item', layout: nil, formats: [:html], locals: render_locals
    end
  end
end