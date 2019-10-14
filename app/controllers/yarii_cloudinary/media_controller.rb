class YariiCloudinary::MediaController < ApplicationController
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
end