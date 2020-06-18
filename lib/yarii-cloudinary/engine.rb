require "cloudinary"

module YariiCloudinary
  class Engine < ::Rails::Engine
    isolate_namespace YariiCloudinary

    # ROOT_PATH = Pathname.new(File.join(__dir__, "..", ".."))

    # config.app_middleware.use(
    #   Rack::Static,
    #   urls: ["/yarii-cloudinary-packs"], root: ROOT_PATH.join("public")
    # )
  end
end
